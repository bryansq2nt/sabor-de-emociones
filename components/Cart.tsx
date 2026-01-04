'use client';

import React from 'react';
import { OrderItem } from '@/lib/order';
import { formatPrice } from '@/lib/products';

interface CartProps {
  items: OrderItem[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  total: number;
}

export function Cart({ items, onRemove, onUpdateQuantity, total }: CartProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <p className="text-coffee/60">Tu pedido está vacío</p>
        <p className="text-sm text-coffee/40 mt-2">Agrega productos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="font-display text-2xl text-chocolate mb-6">Tu Pedido</h2>
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index} className="border-b border-cream pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-chocolate">
                  {item.productName}
                  {item.size && (
                    <span className="text-sm font-normal text-coffee/70 ml-2">
                      ({item.size})
                    </span>
                  )}
                </h3>
                {item.notes && (
                  <p className="text-sm text-coffee/60 italic mt-1">{item.notes}</p>
                )}
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-rose hover:text-rose/80 ml-2"
                aria-label="Eliminar producto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                  className="w-7 h-7 rounded-full bg-cream hover:bg-gold text-coffee font-bold transition-colors text-sm"
                >
                  −
                </button>
                <span className="text-chocolate font-semibold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-cream hover:bg-gold text-coffee font-bold transition-colors text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-gold-deep font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gold pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-display text-chocolate">Total estimado</span>
          <span className="text-3xl font-display text-gold-deep font-bold">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

