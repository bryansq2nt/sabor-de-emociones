import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { Order, formatOrderForEmailText, formatOrderForEmailHtml } from '@/lib/order';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { detectSpam, validateOrigin } from '@/lib/spamDetection';

// Schema de validación con Zod
const orderSchema = z.object({
  name: z.string().min(2).max(60),
  phone: z.string().min(7).max(20).regex(/^[\d\s\+\-\(\)]+$/),
  email: z.string().email().optional().or(z.literal('')),
  pickupOrDelivery: z.enum(['pickup', 'delivery']),
  address: z.string().optional().or(z.literal('')),
  desiredDate: z.string().optional(),
  generalNotes: z.string().max(1200).optional().or(z.literal('')),
  items: z.array(z.any()),
  total: z.number(),
  // Anti-spam fields
  company: z.string().optional(),
  formStartedAt: z.number().optional(),
});

// Función para bloquear silenciosamente (responder 200 OK sin enviar email)
function silentBlock(reason: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SPAM BLOCK] ${reason}`);
  }
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // CAPA E - Verificación de origen
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    if (!validateOrigin(origin, referer)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[SPAM BLOCK] Invalid origin/referer');
      }
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // CAPA C - Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RATE LIMIT] IP ${clientIP} exceeded limit`);
      }
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // CAPA A - Honeypot check
    if (body.company && body.company.trim() !== '') {
      return silentBlock('Honeypot field filled');
    }

    // CAPA B - Human time check
    if (body.formStartedAt) {
      const formStartTime = body.formStartedAt;
      const submitTime = Date.now();
      const timeDiff = submitTime - formStartTime;
      
      if (timeDiff < 3000) { // Menos de 3 segundos
        return silentBlock(`Form submitted too fast: ${timeDiff}ms`);
      }
    }

    // CAPA D - Validación con Zod
    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[VALIDATION ERROR]', validationResult.error);
      }
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    const order = validationResult.data as Order & { company?: string; formStartedAt?: number };

    // Validar dirección si es delivery
    if (order.pickupOrDelivery === 'delivery' && (!order.address || order.address.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Address is required for delivery' },
        { status: 400 }
      );
    }

    // CAPA D - Validación de notas (si existe)
    if (order.generalNotes && order.generalNotes.trim().length > 0) {
      // Validar longitud mínima si se proporciona contenido
      if (order.generalNotes.trim().length < 15) {
        return NextResponse.json(
          { error: 'Notes must be at least 15 characters if provided' },
          { status: 400 }
        );
      }

      // Detección de spam en notas
      const spamCheck = detectSpam(order.generalNotes);
      if (spamCheck.isSpam) {
        return silentBlock(`Spam detected in notes: ${spamCheck.reason}`);
      }
    }

    // Detección de spam en nombre
    const nameSpamCheck = detectSpam(order.name);
    if (nameSpamCheck.isSpam) {
      return silentBlock(`Spam detected in name: ${nameSpamCheck.reason}`);
    }

    // Detección de spam en email si existe
    if (order.email && order.email.trim() !== '') {
      const emailSpamCheck = detectSpam(order.email);
      if (emailSpamCheck.isSpam) {
        return silentBlock(`Spam detected in email: ${emailSpamCheck.reason}`);
      }
    }

    // Validar required environment variables
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO;

    if (!emailHost || !emailPort || !emailUser || !emailPass || !emailTo) {
      console.error('Missing email configuration');
      return NextResponse.json(
        { error: 'Email configuration is missing' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort, 10),
      secure: parseInt(emailPort, 10) === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Format order for email (sin los campos anti-spam)
    const { company, formStartedAt, ...orderForEmail } = order;
    const emailText = formatOrderForEmailText(orderForEmail as Order);
    const emailHtml = formatOrderForEmailHtml(orderForEmail as Order);

    // Send email
    await transporter.sendMail({
      from: `"Sabor de Emociones" <${emailUser}>`,
      to: emailTo,
      replyTo: order.email || emailUser,
      subject: `Nuevo Pedido de ${order.name} - $${order.total.toFixed(2)}`,
      text: emailText,
      html: emailHtml,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[EMAIL SENT] Order from ${order.name} - $${order.total.toFixed(2)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    );
  }
}
