'use client';

import React from 'react';
import { OrderItem } from '@/lib/order';
import { formatPrice } from '@/lib/products';

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  isSticky?: boolean;
}

export function OrderSummary({ items, total, onRemove, onUpdateQuantity, isSticky = false }: OrderSummaryProps) {
  if (items.length === 0) {
    return (
      <div className={`bg-cream rounded-[3rem] p-6 border-2 border-gold/30 ${isSticky ? 'sticky top-4' : ''}`}>
        <h3 className="font-display text-xl text-chocolate mb-2">Resumen de Pedido</h3>
        <p className="text-coffee/60 text-sm">Tu pedido está vacío</p>
      </div>
    );
  }

  return (
    <div className={`bg-cream rounded-[3rem] p-6 border-2 border-gold/30 shadow-lg ${isSticky ? 'sticky top-4' : ''}`}>
      <h3 className="font-display text-xl text-chocolate mb-4">Resumen de Pedido</h3>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="border-b border-gold/20 pb-2 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <div className="text-sm font-semibold text-chocolate">
                  {item.productName}
                  {item.size && (
                    <span className="text-xs font-normal text-coffee/70 ml-1">({item.size})</span>
                  )}
                </div>
                {item.notes && (
                  <div className="text-xs text-coffee/60 italic mt-0.5">{item.notes}</div>
                )}
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-rose hover:text-rose/80 ml-2 text-sm"
                aria-label="Eliminar"
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                  className="w-6 h-6 rounded-full bg-white hover:bg-gold text-coffee font-bold transition-colors text-xs"
                >
                  −
                </button>
                <span className="text-sm text-chocolate font-semibold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-white hover:bg-gold text-coffee font-bold transition-colors text-xs"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-semibold text-gold-deep">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gold pt-4">
        <div className="flex justify-between items-center">
          <span className="font-display text-lg text-chocolate">Total estimado</span>
          <span className="font-display text-2xl text-gold-deep font-bold">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

