'use client';

import React, { useState, RefObject, useEffect } from 'react';
import { OrderItem, Order } from '@/lib/order';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface OrderFormProps {
  items: OrderItem[];
  total: number;
  onSubmitEmail: (order: Order) => Promise<void>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
  firstInputRef?: RefObject<HTMLInputElement>;
  onBack?: () => void;
  onNewOrder?: () => void;
  savedCustomerInfo?: {name: string; phone: string; email: string} | null;
}

export function OrderForm({
  items,
  total,
  onSubmitEmail,
  isSubmitting,
  submitStatus,
  errorMessage,
  firstInputRef,
  onBack,
  onNewOrder,
  savedCustomerInfo,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: savedCustomerInfo?.name || '',
    phone: savedCustomerInfo?.phone || '',
    email: savedCustomerInfo?.email || '',
    pickupOrDelivery: 'pickup' as 'pickup' | 'delivery',
    address: '',
    desiredDate: '',
    generalNotes: '',
  });
  const [formStartedAt] = useState(Date.now()); // Timestamp cuando se renderiza el form

  // Actualizar formData cuando savedCustomerInfo cambie o cuando se resetea el estado
  useEffect(() => {
    if (savedCustomerInfo && submitStatus !== 'success') {
      setFormData(prev => ({
        ...prev,
        name: savedCustomerInfo.name,
        phone: savedCustomerInfo.phone,
        email: savedCustomerInfo.email,
      }));
    } else if (!savedCustomerInfo && submitStatus === 'idle') {
      // Limpiar solo los campos que no son de información del cliente
      setFormData(prev => ({
        ...prev,
        address: '',
        desiredDate: '',
        generalNotes: '',
      }));
    }
  }, [savedCustomerInfo, submitStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    if (!formData.name || !formData.phone) {
      return;
    }

    if (formData.pickupOrDelivery === 'delivery' && !formData.address) {
      return;
    }

    // Get honeypot value from form
    const form = e.currentTarget as HTMLFormElement;
    const formDataObj = new FormData(form);
    const companyValue = formDataObj.get('company') as string || '';
    const formStartedAtValue = formDataObj.get('formStartedAt') 
      ? parseInt(formDataObj.get('formStartedAt') as string, 10) 
      : formStartedAt;

    const order: Order & { company?: string; formStartedAt?: number } = {
      ...formData,
      items,
      total,
      // Anti-spam fields
      company: companyValue,
      formStartedAt: formStartedAtValue,
    };

    await onSubmitEmail(order as Order);
  };

  const handleWhatsAppSubmit = () => {
    if (items.length === 0) return;
    if (!formData.name || !formData.phone) return;
    if (formData.pickupOrDelivery === 'delivery' && !formData.address) return;

    const order: Order = {
      ...formData,
      items,
      total,
    };

    window.open(getWhatsAppUrl(order), '_blank');
  };

  // Mostrar mensaje de confirmación cuando el pedido se envió exitosamente
  if (submitStatus === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-400/50">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-cream mb-4">
            ¡Pedido Realizado!
          </h3>
          <p className="text-cream/90 text-lg mb-2">
            Tu pedido ha sido recibido correctamente.
          </p>
          <p className="text-cream/80 text-base mb-4">
            Te notificaremos pronto sobre el estado de tu orden y las opciones de pago disponibles.
          </p>
        </div>

        {onNewOrder && (
          <button
            type="button"
            onClick={onNewOrder}
            className="w-full bg-gold text-chocolate py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[0_0_25px_rgba(218,165,32,0.9)]"
          >
            Hacer otro pedido
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-cream/80 hover:text-cream flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Editar pedido
        </button>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-900/40 border-2 border-red-400/30 rounded-[2.5rem] text-red-200 text-center backdrop-blur-sm">
          <p className="font-semibold">{errorMessage || 'Hubo un error al procesar tu pedido'}</p>
          <p className="text-sm mt-1">Por favor, intenta por WhatsApp o llámanos.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-cream mb-3 text-lg">
            Nombre *
          </label>
          <input
            ref={firstInputRef}
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 bg-cream/10 border border-gold/30 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-cream placeholder-cream/50 backdrop-blur-sm"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-cream mb-3 text-lg">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-6 py-4 bg-cream/10 border border-gold/30 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-cream placeholder-cream/50 backdrop-blur-sm"
            placeholder="+1 (xxx) xxx-xxxx"
          />
        </div>
      </div>

      <div>
          <label htmlFor="email" className="block text-sm font-medium text-cream mb-3 text-lg">
          Email (opcional)
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-6 py-4 bg-stone-800/60 border-2 border-amber-500/30 rounded-[2.5rem] focus:outline-none focus:border-amber-400 transition-all text-amber-100 placeholder-amber-400/50 shadow-inner backdrop-blur-sm"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cream mb-4 text-lg">
          ¿Cómo te gustaría recibir tu pedido? *
        </label>
        <div className="grid grid-cols-2 gap-4">
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
              className={`p-6 rounded-[2.5rem] border-2 text-center transition-all ${
                formData.pickupOrDelivery === 'pickup'
                  ? 'border-gold bg-gold/20 scale-105'
                  : 'border-gold/30 hover:border-gold bg-cream/10'
              }`}
            >
              <div className="font-semibold text-cream text-lg">Recoger</div>
              <div className="text-sm text-cream/70 mt-1">Ven por tu pedido</div>
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
              className={`p-6 rounded-[2.5rem] border-2 text-center transition-all ${
                formData.pickupOrDelivery === 'delivery'
                  ? 'border-gold bg-gold/20 scale-105'
                  : 'border-gold/30 hover:border-gold bg-cream/10'
              }`}
            >
              <div className="font-semibold text-cream text-lg">Entrega</div>
              <div className="text-sm text-cream/70 mt-1">A domicilio</div>
            </div>
          </label>
        </div>
      </div>

      {formData.pickupOrDelivery === 'delivery' && (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-cream mb-3 text-lg">
            Dirección completa *
          </label>
          <textarea
            id="address"
            required={formData.pickupOrDelivery === 'delivery'}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-6 py-4 bg-cream/10 border border-gold/30 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-cream placeholder-cream/50 backdrop-blur-sm resize-none"
            placeholder="Calle, número, ciudad, código postal"
            rows={3}
          />
        </div>
      )}

      <div>
          <label htmlFor="desiredDate" className="block text-sm font-medium text-cream mb-3 text-lg">
          Fecha deseada (opcional)
        </label>
        <input
          type="date"
          id="desiredDate"
          value={formData.desiredDate}
          onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-6 py-4 bg-cream/10 border border-gold/30 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-cream backdrop-blur-sm"
        />
      </div>

      <div>
          <label htmlFor="generalNotes" className="block text-sm font-medium text-cream mb-3 text-lg">
          Notas generales (opcional)
        </label>
        <textarea
          id="generalNotes"
          value={formData.generalNotes}
          onChange={(e) => setFormData({ ...formData, generalNotes: e.target.value })}
          className="w-full px-6 py-4 bg-stone-800/60 border-2 border-amber-500/30 rounded-[2.5rem] focus:outline-none focus:border-amber-400 transition-all text-amber-100 placeholder-amber-400/50 shadow-inner backdrop-blur-sm resize-none"
          placeholder="Alguna instrucción especial..."
          rows={3}
        />
      </div>

      {/* Anti-spam hidden fields - Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          width: '1px', 
          height: '1px', 
          opacity: 0, 
          pointerEvents: 'none',
          visibility: 'hidden'
        }}
        aria-hidden="true"
      />
      {/* Timestamp del inicio del formulario */}
      <input
        type="hidden"
        name="formStartedAt"
        value={formStartedAt}
      />

      <div className="pt-6 border-t border-gold/30">
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="w-full bg-gold text-chocolate py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[0_0_25px_rgba(218,165,32,0.9)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Procesando...' : 'Finalizar pedido'}
          </button>
          
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full border-2 border-rose-400/60 hover:border-rose-400 text-rose-300 hover:text-rose-200 bg-transparent py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              
              Editar pedido
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

