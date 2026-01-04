import { Order } from './order';

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
    order.desiredDate ? `📅 *Fecha deseada:* ${order.desiredDate}` : '',
    order.generalNotes ? `📝 *Notas:* ${order.generalNotes}` : '',
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
    'Gracias — Sabor de Emociones'
  );

  return lines.filter((line) => line !== '').join('\n');
}

export function getWhatsAppUrl(order: Order): string {
  const message = formatOrderForWhatsApp(order);
  return `https://wa.me/15719103088?text=${encodeURIComponent(message)}`;
}

