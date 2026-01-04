import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Order, formatOrderForEmailText, formatOrderForEmailHtml } from '@/lib/order';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();

    // Validate required environment variables
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

    // Format order for email
    const emailText = formatOrderForEmailText(order);
    const emailHtml = formatOrderForEmailHtml(order);

    // Send email
    await transporter.sendMail({
      from: `"Sabor de Emociones" <${emailUser}>`,
      to: emailTo,
      replyTo: order.email || emailUser,
      subject: `Nuevo Pedido de ${order.name} - $${order.total.toFixed(2)}`,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    );
  }
}

