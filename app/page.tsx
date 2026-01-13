'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ConfettiRain } from '@/components/ConfettiRain';
import { PastelSection } from '@/components/PastelSection';
import { ProductCards } from '@/components/ProductCards';
import { OrderSummary } from '@/components/OrderSummary';
import { OrderForm } from '@/components/OrderForm';
import { OrderItem, Order } from '@/lib/order';
import { content } from '@/lib/content';

const WHATSAPP_NUMBER = '15719103088';
const INSTAGRAM_URL = 'https://www.instagram.com/ivis__bakery/'; // Actualizar con la URL real de Instagram

export default function HomePage() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [savedCustomerInfo, setSavedCustomerInfo] = useState<{name: string; phone: string; email: string} | null>(null);
  const flipContainerRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Check for prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

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
        if (response.status === 429) {
          throw new Error('Demasiadas solicitudes. Por favor, espera unos minutos e intenta nuevamente.');
        } else if (response.status === 403) {
          throw new Error('Solicitud no autorizada. Por favor, intenta nuevamente.');
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Datos inválidos. Por favor, verifica tu información.');
        } else {
          throw new Error('Error al enviar el pedido');
        }
      }

      setSubmitStatus('success');
      // Guardar información del cliente para futuros pedidos
      setSavedCustomerInfo({
        name: order.name,
        phone: order.phone,
        email: order.email || '',
      });
      setCartItems([]);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Hubo un problema al enviar tu pedido. Por favor, intenta por WhatsApp o llámanos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    // Scroll to container after state update
    requestAnimationFrame(() => {
      flipContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBackClick = () => {
    setShowCheckout(false);
  };

  const handleNewOrder = () => {
    setShowCheckout(false);
    setSubmitStatus('idle');
    setCartItems([]);
  };

  // Focus first input when entering checkout
  useEffect(() => {
    if (showCheckout && firstInputRef.current) {
      requestAnimationFrame(() => {
        firstInputRef.current?.focus();
      });
    }
  }, [showCheckout]);


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
              className="bg-gold text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.8)]"
            >
              Ordenar ahora
            </a>
          
          </div>
         
        </div>
      </PastelSection>

      {/* PRODUCTOS + ORDENAR - Flip Card Container */}
      <PastelSection variant="both" bgColor="#4F355F" className="py-16 md:py-24" id="productos">
        <div className="max-w-7xl mx-auto px-4">
          {/* Flip Card Wrapper */}
          <div 
            ref={flipContainerRef}
            className="relative overflow-hidden"
            style={{ 
              perspective: '2000px',
              minHeight: '600px',
            }}
          >
            {/* Inner container with 3D transform */}
            <div
              className="relative w-full preserve-3d"
              style={{
                transformStyle: 'preserve-3d',
                transform: showCheckout ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: prefersReducedMotion ? 'none' : 'transform 400ms ease-in-out',
                willChange: 'transform',
              }}
            >
              {/* FRONT FACE - Productos */}
              <div 
                className="w-full backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: '#4F355F',
                  transform: 'rotateY(0deg)',
                  position: showCheckout ? 'absolute' : 'relative',
                  top: showCheckout ? 0 : 'auto',
                  left: showCheckout ? 0 : 'auto',
                  right: showCheckout ? 0 : 'auto',
                  bottom: showCheckout ? 0 : 'auto',
                }}
              >
                <div className="text-center mb-12">
                  <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
                    Nuestros Postres
                  </h2>
                  <p className="text-cream/80 text-lg max-w-2xl mx-auto">
                    Cada postre está hecho con ingredientes frescos y mucho cariño
                  </p>
                </div>
                
                <div className="flex flex-col gap-8">
                  <ProductCards onAddToCart={handleAddToCart} />
                  
                  {/* Order Summary - Desktop and Mobile */}
                  {cartItems.length > 0 && (
                    <div className="mt-8">
                      <OrderSummary
                        items={cartItems}
                        total={total}
                        onRemove={handleRemoveFromCart}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    </div>
                  )}
                </div>

                {/* CTA Button - Ordenar en línea */}
                {total > 0 && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleCheckoutClick}
                      className="bg-gold text-chocolate px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-xl hover:shadow-[0_0_25px_rgba(218,165,32,0.9)]"
                    >
                      Completar Pedido
                    </button>
                  </div>
                )}
              </div>

              {/* BACK FACE - Formulario */}
              <div
                className="w-full backface-hidden"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: '#4F355F',
                  position: showCheckout ? 'relative' : 'absolute',
                  top: showCheckout ? 'auto' : 0,
                  left: showCheckout ? 'auto' : 0,
                  right: showCheckout ? 'auto' : 0,
                  bottom: showCheckout ? 'auto' : 0,
                }}
              >
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
                    firstInputRef={firstInputRef}
                    onBack={handleBackClick}
                    onNewOrder={handleNewOrder}
                    savedCustomerInfo={savedCustomerInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PastelSection>

      {/* CATERING */}
      <PastelSection variant="both" bgColor="#44403c" className="py-16 md:py-24 relative overflow-hidden">
        {/* Textura sutil de fondo */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath d='M20 20 Q30 10 40 20 T60 20' stroke='%23F8D5A9' fill='none' stroke-width='0.5'/%3E%3Cpath d='M25 35 Q35 25 45 35 T65 35' stroke='%23F8D5A9' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='15' cy='15' r='1' fill='%23F8D5A9'/%3E%3Ccircle cx='85' cy='25' r='1' fill='%23F8D5A9'/%3E%3Ccircle cx='50' cy='50' r='1' fill='%23F8D5A9'/%3E%3Cpath d='M70 15 L75 20 L70 25 L65 20 Z' fill='%23F8D5A9'/%3E%3Cpath d='M10 40 L15 45 L10 50 L5 45 Z' fill='%23F8D5A9'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Encabezado */}
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
            Catering & Eventos
          </h2>
          <p className="text-cream/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Postres que acompañan momentos importantes
          </p>
          
          {/* Separador decorativo */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px bg-gold/40 flex-1 max-w-[100px]"></div>
            <svg className="w-5 h-5 text-gold/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div className="h-px bg-gold/40 flex-1 max-w-[100px]"></div>
          </div>

          {/* Contenido descriptivo */}
          <p className="text-cream/90 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Cada celebración merece postres que se recuerden. 
            Llevamos el sabor artesanal de Sabor de Emociones a tus momentos especiales, 
            creando experiencias dulces que complementan la alegría de cada ocasión.
          </p>

          {/* Ejemplos de eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto text-left">
            <div className="bg-cream/5 backdrop-blur-sm rounded-[2rem] p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <h3 className="font-display text-xl text-cream font-semibold">Cumpleaños</h3>
              </div>
              <p className="text-cream/70 text-sm">Celebra con postres que endulzan cada momento especial</p>
            </div>

            <div className="bg-cream/5 backdrop-blur-sm rounded-[2rem] p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-display text-xl text-cream font-semibold">Reuniones familiares</h3>
              </div>
              <p className="text-cream/70 text-sm">Postres que unen y crean recuerdos compartidos</p>
            </div>

            <div className="bg-cream/5 backdrop-blur-sm rounded-[2rem] p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-display text-xl text-cream font-semibold">Eventos pequeños</h3>
              </div>
              <p className="text-cream/70 text-sm">Celebraciones íntimas con sabor artesanal</p>
            </div>

            <div className="bg-cream/5 backdrop-blur-sm rounded-[2rem] p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className="font-display text-xl text-cream font-semibold">Celebraciones especiales</h3>
              </div>
              <p className="text-cream/70 text-sm">Momentos únicos que merecen postres únicos</p>
            </div>
          </div>

          {/* Botón CTA */}
          <div className="flex flex-col items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.8)]"
            >
              Cotizar mi evento
            </a>
            <p className="text-cream/60 text-sm max-w-md">
              Cada evento se cotiza según cantidad y tipo de celebración
            </p>
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
      <PastelSection variant="top" bgColor="#4F355F" className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-2xl text-cream mb-2">{content.footer.brand}</p>
          <p className="text-cream/70 mb-6">{content.footer.location}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="https://g.page/r/CR36H6la4rXrEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.8)] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Deja una Reseña
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.8)] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a
              href="#productos"
              className="bg-gold text-chocolate px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.8)]"
            >
              Ordenar en línea
            </a>
          </div>
          <p className="text-cream/60 text-sm">{content.footer.note}</p>
        </div>
      </PastelSection>
    </main>
  );
}
