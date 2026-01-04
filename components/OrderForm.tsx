'use client';

import React, { useState } from 'react';
import { OrderItem, Order } from '@/lib/order';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface OrderFormProps {
  items: OrderItem[];
  total: number;
  onSubmitEmail: (order: Order) => Promise<void>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}

export function OrderForm({
  items,
  total,
  onSubmitEmail,
  isSubmitting,
  submitStatus,
  errorMessage,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupOrDelivery: 'pickup' as 'pickup' | 'delivery',
    address: '',
    desiredDate: '',
    generalNotes: '',
  });

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

    const order: Order = {
      ...formData,
      items,
      total,
    };

    await onSubmitEmail(order);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-900/40 border-2 border-green-400/30 rounded-[2.5rem] text-green-200 text-center backdrop-blur-sm">
          <p className="font-semibold">¡Pedido enviado correctamente! ✅</p>
          <p className="text-sm mt-1">Te contactaremos pronto para confirmar tu pedido.</p>
        </div>
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

      <div className="pt-6 border-t border-gold/30">
        <div className="flex flex-col sm:flex-row gap-4">
         
          <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="flex-1 bg-gold hover:bg-gold-deep text-chocolate py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </div>
    </form>
  );
}

