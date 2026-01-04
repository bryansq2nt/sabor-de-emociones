'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ConfettiRain } from '@/components/ConfettiRain';
import { PastelSection } from '@/components/PastelSection';
import { ProductCards } from '@/components/ProductCards';
import { OrderSummary } from '@/components/OrderSummary';
import { OrderForm } from '@/components/OrderForm';
import { OrderItem, Order } from '@/lib/order';
import { content } from '@/lib/content';

const WHATSAPP_NUMBER = '15719103088';
const PHONE_NUMBER = '+15719103088';

export default function HomePage() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddToCart = (item: OrderItem) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const updated = [...cartItems];
    updated[index].quantity = quantity;
    setCartItems(updated);
  };

  const handleSubmitEmail = async (order: Order) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

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
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Hubo un problema al enviar tu pedido. Por favor, intenta por WhatsApp o llámanos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <ConfettiRain />
      
      {/* HERO */}
      <PastelSection variant="bottom" bgColor="#292524" className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo-sabor-de-emociones.jpeg"
                alt="Sabor de Emociones Logo"
                width={300}
                height={300}
                className="mx-auto rounded-full shadow-2xl border-4 border-gold/30 object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-cream mb-4 text-balance">
            {content.hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-cream/80 mb-10 font-light">
            {content.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#productos"
              className="bg-gold hover:bg-gold-deep text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              Ordenar ahora
            </a>
          
          </div>
         
        </div>
      </PastelSection>

      {/* PRODUCTOS */}
      <PastelSection variant="both" bgColor="#4F355F" className="py-16 md:py-24" id="productos">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
              Nuestros Postres
            </h2>
            <p className="text-cream/80 text-lg max-w-2xl mx-auto">
              Cada postre está hecho con ingredientes frescos y mucho cariño
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ProductCards onAddToCart={handleAddToCart} />
            </div>
            <div className="lg:col-span-1">
              <div className="hidden lg:block">
                <OrderSummary
                  items={cartItems}
                  total={total}
                  onRemove={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isSticky={true}
                />
              </div>
            </div>
          </div>

          {/* Mobile Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:hidden mt-8">
              <OrderSummary
                items={cartItems}
                total={total}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>
          )}
        </div>
      </PastelSection>

      {/* ORDENAR */}
      <PastelSection variant="both" bgColor="#292524" className="py-16 md:py-24" id="ordenar">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
              Completa tu Pedido
            </h2>
            <p className="text-cream/80 text-lg max-w-2xl mx-auto">
              Cuéntanos cómo te gustaría recibir tus postres
            </p>
          </div>

          <div className="bg-cream/5 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-2 border-gold/20">
            <OrderForm
              items={cartItems}
              total={total}
              onSubmitEmail={handleSubmitEmail}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </PastelSection>

      {/* CATERING */}
      <PastelSection variant="both" bgColor="#44403c" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
            {content.catering.title}
          </h2>
          <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {content.catering.text}
          </p>
          <p className="text-cream font-semibold mb-6">{content.catering.cta}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              Cotizar ahora
            </a>
            
          </div>
        </div>
      </PastelSection>

      {/* STORY */}
      <PastelSection variant="both" bgColor="#292524" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-8 text-center">
            {content.story.title}
          </h2>
          <div className="bg-cream/5 backdrop-blur-sm rounded-[4rem] p-8 md:p-12 border-2 border-gold/20">
            <p className="text-cream/90 text-lg md:text-xl leading-relaxed whitespace-pre-line">
              {content.story.text}
            </p>
          </div>
        </div>
      </PastelSection>

      {/* FOOTER */}
      <PastelSection variant="top" bgColor="#44403c" className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-2xl text-cream mb-2">{content.footer.brand}</p>
          <p className="text-cream/70 mb-6">{content.footer.location}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-deep text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Deja una Reseña
            </a>
            <a
      href="#productos"
      className="bg-gold hover:bg-gold-deep text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
    >
      Ordenar ahora
    </a>
          </div>
          <p className="text-cream/60 text-sm">{content.footer.note}</p>
        </div>
      </PastelSection>
    </main>
  );
}
