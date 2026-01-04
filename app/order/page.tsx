'use client';

import React, { useState } from 'react';
import { products, getProductById, ProductSize } from '@/lib/products';
import { OrderItem, Order, formatOrderForWhatsApp, formatOrderForEmail } from '@/lib/order';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';

const WHATSAPP_NUMBER = '15719103088';
const PHONE_NUMBER = '+15719103088';

export default function OrderPage() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupOrDelivery: 'pickup' as 'pickup' | 'delivery',
    address: '',
    desiredDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddToCart = (productId: string, size?: ProductSize, quantity: number = 1, notes?: string) => {
    const product = getProductById(productId);
    if (!product) return;

    const price = size
      ? product.sizes?.find((s) => s.size === size)?.price || product.fixedPrice || 0
      : product.fixedPrice || 0;

    const newItem: OrderItem = {
      productId,
      productName: product.name,
      size,
      quantity,
      price,
      notes: notes || undefined,
    };

    setCartItems([...cartItems, newItem]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const updated = [...cartItems];
    updated[index].quantity = quantity;
    setCartItems(updated);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, agrega al menos un producto a tu pedido');
      return;
    }

    if (!formData.name || !formData.phone || !formData.desiredDate) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, completa todos los campos requeridos');
      return;
    }

    if (formData.pickupOrDelivery === 'delivery' && !formData.address) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, proporciona una dirección para la entrega');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const order: Order = {
      ...formData,
      items: cartItems,
      total,
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      setSubmitStatus('success');
      setCartItems([]);
      setFormData({
        name: '',
        phone: '',
        email: '',
        pickupOrDelivery: 'pickup',
        address: '',
        desiredDate: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Hubo un problema al enviar tu pedido. Por favor, intenta por WhatsApp o llámanos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, agrega al menos un producto a tu pedido');
      return;
    }

    if (!formData.name || !formData.phone || !formData.desiredDate) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, completa todos los campos requeridos');
      return;
    }

    if (formData.pickupOrDelivery === 'delivery' && !formData.address) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, proporciona una dirección para la entrega');
      return;
    }

    const order: Order = {
      ...formData,
      items: cartItems,
      total,
    };

    const message = formatOrderForWhatsApp(order);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-6xl text-chocolate mb-4">
            Haz tu Pedido
          </h1>
          <p className="text-coffee/80 text-lg max-w-2xl mx-auto">
            Selecciona tus postres favoritos y completa tu información. Te confirmaremos tu pedido pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Products */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-3xl text-chocolate mb-6">Nuestros Postres</h2>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              total={total}
            />
          </div>
        </div>

        {/* Order Form */}
        {cartItems.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="font-display text-3xl text-chocolate mb-8 text-center">
                Completa tu Información
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-800 text-center">
                  <p className="font-semibold">¡Pedido enviado correctamente!</p>
                  <p className="text-sm mt-1">Te contactaremos pronto para confirmar tu pedido.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800 text-center">
                  <p className="font-semibold">{errorMessage || 'Hubo un error al procesar tu pedido'}</p>
                </div>
              )}

              <form onSubmit={handleSubmitEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-coffee mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-coffee mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
                      placeholder="+1 (xxx) xxx-xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-coffee mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee mb-4">
                    ¿Cómo te gustaría recibir tu pedido? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pickupOrDelivery"
                        value="pickup"
                        checked={formData.pickupOrDelivery === 'pickup'}
                        onChange={(e) =>
                          setFormData({ ...formData, pickupOrDelivery: e.target.value as 'pickup' | 'delivery' })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          formData.pickupOrDelivery === 'pickup'
                            ? 'border-gold bg-gold/10'
                            : 'border-cream hover:border-gold/50'
                        }`}
                      >
                        <div className="font-semibold text-chocolate">Recoger</div>
                        <div className="text-sm text-coffee/70 mt-1">Ven por tu pedido</div>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pickupOrDelivery"
                        value="delivery"
                        checked={formData.pickupOrDelivery === 'delivery'}
                        onChange={(e) =>
                          setFormData({ ...formData, pickupOrDelivery: e.target.value as 'pickup' | 'delivery' })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          formData.pickupOrDelivery === 'delivery'
                            ? 'border-gold bg-gold/10'
                            : 'border-cream hover:border-gold/50'
                        }`}
                      >
                        <div className="font-semibold text-chocolate">Entrega</div>
                        <div className="text-sm text-coffee/70 mt-1">A domicilio</div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.pickupOrDelivery === 'delivery' && (
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-coffee mb-2">
                      Dirección completa *
                    </label>
                    <textarea
                      id="address"
                      required={formData.pickupOrDelivery === 'delivery'}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
                      placeholder="Calle, número, ciudad, código postal"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="desiredDate" className="block text-sm font-medium text-coffee mb-2">
                    Fecha deseada para recibir tu pedido *
                  </label>
                  <input
                    type="date"
                    id="desiredDate"
                    required
                    value={formData.desiredDate}
                    onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
                  />
                </div>

                <div className="pt-6 border-t border-cream">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Enviar por WhatsApp
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gold hover:bg-gold-deep text-chocolate py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Enviando...' : 'Ordenar en linea'}
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="text-coffee/70 hover:text-gold-deep font-medium"
                    >
                      O llámanos: {PHONE_NUMBER}
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

