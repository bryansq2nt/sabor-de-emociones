'use client';

import React, { useState } from 'react';
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
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

  const handleDecrease = (index: number, currentQuantity: number) => {
    if (currentQuantity === 1) {
      // Si la cantidad es 1, eliminar con animación
      handleRemoveWithAnimation(index);
    } else {
      // Si la cantidad es mayor a 1, solo disminuir
      onUpdateQuantity(index, currentQuantity - 1);
    }
  };

  const handleRemoveWithAnimation = (index: number) => {
    // Agregar el índice a los items que se están eliminando
    setRemovingItems((prev) => new Set(prev).add(index));
    
    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
      onRemove(index);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 400); // Duración de la animación
  };
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
          <div
            key={index}
            className={`border-b border-gold/20 pb-2 last:border-0 transition-all duration-400 ${
              removingItems.has(index) ? 'slide-out-left' : ''
            }`}
            style={{
              animation: removingItems.has(index) ? 'slideOutLeft 0.4s ease-in-out forwards' : undefined,
            }}
          >
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
                onClick={() => handleRemoveWithAnimation(index)}
                className="text-rose hover:text-rose/80 ml-2 text-sm"
                aria-label="Eliminar"
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrease(index, item.quantity)}
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

