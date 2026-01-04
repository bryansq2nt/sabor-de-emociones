import { Product, ProductSize } from './products';

export interface OrderItem {
  productId: string;
  productName: string;
  size?: ProductSize;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  name: string;
  phone: string;
  email?: string;
  pickupOrDelivery: 'pickup' | 'delivery';
  address?: string;
  desiredDate?: string;
  generalNotes?: string;
  items: OrderItem[];
  total: number;
}

export function formatOrderForWhatsApp(order: Order): string {
  const lines = [
    '🍰 *PEDIDO - Sabor de Emociones*',
    '',
    `👤 *Nombre:* ${order.name}`,
    `📞 *Teléfono:* ${order.phone}`,
    order.email ? `📧 *Email:* ${order.email}` : '',
    '',
    `📍 *Tipo:* ${order.pickupOrDelivery === 'pickup' ? 'Recoger' : 'Entrega a domicilio'}`,
    order.address ? `🏠 *Dirección:* ${order.address}` : '',
    `📅 *Fecha deseada:* ${order.desiredDate}`,
    '',
    '🍰 *Productos:*',
    '',
  ];

  order.items.forEach((item) => {
    const sizeText = item.size ? ` (${item.size})` : '';
    const notesText = item.notes ? `\n   Nota: ${item.notes}` : '';
    lines.push(
      `• ${item.productName}${sizeText} x${item.quantity}`,
      `  $${item.price.toFixed(2)} c/u${notesText}`,
      ''
    );
  });

  lines.push(
    `💰 *Total estimado: $${order.total.toFixed(2)}*`,
    '',
    'Gracias por elegir Sabor de Emociones 💛'
  );

  return lines.filter((line) => line !== '').join('\n');
}

export function formatOrderForEmailText(order: Order): string {
  return `
NUEVO PEDIDO - Sabor de Emociones

INFORMACIÓN DEL CLIENTE
Nombre: ${order.name}
Teléfono: ${order.phone}
${order.email ? `Email: ${order.email}` : ''}

DETALLES DE ENTREGA
Tipo: ${order.pickupOrDelivery === 'pickup' ? 'Recoger en tienda' : 'Entrega a domicilio'}
${order.address ? `Dirección: ${order.address}` : ''}
${order.desiredDate ? `Fecha deseada: ${order.desiredDate}` : ''}
${order.generalNotes ? `\nNotas generales: ${order.generalNotes}` : ''}

PRODUCTOS
${order.items.map((item) => {
  const sizeText = item.size ? ` (${item.size})` : '';
  const notesText = item.notes ? `\n  Nota: ${item.notes}` : '';
  return `${item.productName}${sizeText} - Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)} c/u${notesText}`;
}).join('\n')}

TOTAL ESTIMADO: $${order.total.toFixed(2)}

Gracias por elegir Sabor de Emociones 💛
  `.trim();
}

export function formatOrderForEmailHtml(order: Order): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #1B1511; color: #F8D5A9; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
      .section { margin-bottom: 25px; }
      .section-title { color: #A26D49; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
      .item { padding: 10px 0; border-bottom: 1px solid #eee; }
      .total { font-size: 20px; font-weight: bold; color: #A26D49; text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #A26D49; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🍰 Nuevo Pedido - Sabor de Emociones</h1>
      </div>
      <div class="content">
        <div class="section">
          <div class="section-title">Información del Cliente</div>
          <p><strong>Nombre:</strong> ${order.name}</p>
          <p><strong>Teléfono:</strong> ${order.phone}</p>
          ${order.email ? `<p><strong>Email:</strong> ${order.email}</p>` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Detalles de Entrega</div>
          <p><strong>Tipo:</strong> ${order.pickupOrDelivery === 'pickup' ? 'Recoger en tienda' : 'Entrega a domicilio'}</p>
          ${order.address ? `<p><strong>Dirección:</strong> ${order.address}</p>` : ''}
          ${order.desiredDate ? `<p><strong>Fecha deseada:</strong> ${order.desiredDate}</p>` : ''}
          ${order.generalNotes ? `<p><strong>Notas generales:</strong> ${order.generalNotes}</p>` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Productos</div>
          ${order.items.map((item) => {
            const sizeText = item.size ? ` (${item.size})` : '';
            const notesText = item.notes ? `<br><em>Nota: ${item.notes}</em>` : '';
            return `
              <div class="item">
                <strong>${item.productName}${sizeText}</strong><br>
                Cantidad: ${item.quantity} | Precio: $${item.price.toFixed(2)} c/u${notesText}
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="total">
          Total estimado: $${order.total.toFixed(2)}
        </div>
      </div>
      <div class="footer">
        <p>Gracias por elegir Sabor de Emociones 💛</p>
        <p>Este pedido fue enviado desde el sitio web</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

// Backward compatibility
export function formatOrderForEmail(order: Order): string {
  return formatOrderForEmailText(order);
}

