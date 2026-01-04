'use client';

import React from 'react';
import { Product, ProductSize } from '@/lib/products';
import { formatPrice } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, size?: ProductSize, quantity?: number, notes?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = React.useState<ProductSize | undefined>(
    product.sizes ? product.sizes[0].size : undefined
  );
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState('');

  const price = selectedSize
    ? product.sizes?.find((s) => s.size === selectedSize)?.price || product.fixedPrice || 0
    : product.fixedPrice || 0;

  const handleAdd = () => {
    onAddToCart(product.id, selectedSize, quantity, notes.trim() || undefined);
    setQuantity(1);
    setNotes('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <h3 className="font-display text-2xl text-chocolate mb-2">{product.name}</h3>
        <p className="text-coffee/80 mb-4 text-sm leading-relaxed">{product.description}</p>

        {product.sizes && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-coffee mb-2">Tamaño</label>
            <div className="flex gap-2">
              {product.sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption.size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSize === sizeOption.size
                      ? 'bg-gold text-chocolate'
                      : 'bg-cream text-coffee hover:bg-gold/50'
                  }`}
                >
                  {sizeOption.size.charAt(0).toUpperCase() + sizeOption.size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-coffee mb-2">Cantidad</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-cream hover:bg-gold text-coffee font-bold transition-colors"
            >
              −
            </button>
            <span className="text-lg font-semibold text-chocolate w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-cream hover:bg-gold text-coffee font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-coffee mb-2">Notas especiales (opcional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Sin nueces, ex..."
            className="w-full px-4 py-2 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-coffee"
          />
        </div> */}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-display text-gold-deep font-bold">
            {formatPrice(price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-gold hover:bg-gold-deep text-chocolate py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] shadow-md"
        >
          Agregar al pedido
        </button>
      </div>
    </div>
  );
}

