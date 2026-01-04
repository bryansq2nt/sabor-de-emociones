'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { products, Product, ProductSize, formatPrice } from '@/lib/products';
import { OrderItem } from '@/lib/order';

interface ProductCardsProps {
  onAddToCart: (item: OrderItem) => void;
}

export function ProductCards({ onAddToCart }: ProductCardsProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({});

  const handleAddProduct = (product: Product) => {
    const productId = product.id;
    const size = product.sizes ? selectedSizes[productId] || product.sizes[0].size : undefined;
    const quantity = quantities[productId] || 1;
    const productNotes = notes[productId]?.trim() || undefined;

    const price = size
      ? product.sizes?.find((s) => s.size === size)?.price || product.fixedPrice || 0
      : product.fixedPrice || 0;

    const item: OrderItem = {
      productId,
      productName: product.name,
      size,
      quantity,
      price,
      notes: productNotes,
    };

    onAddToCart(item);
    
    // Show feedback
    setAddedProducts({ ...addedProducts, [productId]: true });
    setTimeout(() => {
      setAddedProducts((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }, 3000);
    
    // Reset form for this product
    setQuantities({ ...quantities, [productId]: 1 });
    setNotes({ ...notes, [productId]: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-6 lg:gap-8">
        {products.map((product) => {
          const productId = product.id;
          const selectedSize = selectedSizes[productId] || (product.sizes ? product.sizes[0].size : undefined);
          const quantity = quantities[productId] || 1;
          const price = selectedSize
            ? product.sizes?.find((s) => s.size === selectedSize)?.price || product.fixedPrice || 0
            : product.fixedPrice || 0;

          // Determinar si el producto tiene imagen y obtener todas las imágenes
          const hasImage = product.id === 'tres-leches' || product.id === 'flan';
          const getProductImages = (productId: string): string[] => {
            if (productId === 'tres-leches') {
              return ['/products/tres-leches-1.png'];
            } else if (productId === 'flan') {
              return ['/products/flan-1.png'];
            }
            return [];
          };
          
          const productImages = getProductImages(product.id);
          const currentIndex = currentImageIndex[product.id] || 0;
          
          const nextImage = () => {
            setCurrentImageIndex({
              ...currentImageIndex,
              [product.id]: (currentIndex + 1) % productImages.length
            });
          };
          
          const prevImage = () => {
            setCurrentImageIndex({
              ...currentImageIndex,
              [product.id]: (currentIndex - 1 + productImages.length) % productImages.length
            });
          };

           return (
             <div
               key={product.id}
               className="bg-cream/5 backdrop-blur-sm rounded-[2.5rem] border border-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row overflow-hidden"
               style={{
                 animation: addedProducts[productId] ? 'zoomInOut 0.6s ease-in-out' : undefined,
               }}
             >
               {/* Columna Izquierda - Imagen, Nombre, Descripción (Mobile: arriba, Desktop: izquierda) */}
               <div className="lg:w-1/2 flex flex-col order-1 lg:order-1">
                 {/* Imagen del producto */}
                 <div className="relative w-full h-72 lg:h-full lg:min-h-[400px] rounded-t-[2.5rem] lg:rounded-l-[2.5rem] lg:rounded-tr-none overflow-hidden bg-cream/5 border-b lg:border-b-0 lg:border-r border-gold/10">
                   {hasImage && productImages.length > 0 ? (
                     <>
                       <div className="relative w-full h-full flex items-center justify-center p-4">
                         <Image
                           src={productImages[currentIndex]}
                           alt={`${product.name} - Imagen ${currentIndex + 1}`}
                           fill
                           className="object-contain"
                           priority={product.id === 'tres-leches' && currentIndex === 0}
                         />
                         
                         {/* Botones de navegación */}
                         {productImages.length > 1 && (
                           <>
                             <button
                               onClick={prevImage}
                               className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/10 backdrop-blur-sm hover:bg-cream/20 border border-gold/30 text-cream rounded-full p-2.5 shadow-lg transition-all hover:scale-110 z-10"
                               aria-label="Imagen anterior"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                               </svg>
                             </button>
                             <button
                               onClick={nextImage}
                               className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/10 backdrop-blur-sm hover:bg-cream/20 border border-gold/30 text-cream rounded-full p-2.5 shadow-lg transition-all hover:scale-110 z-10"
                               aria-label="Siguiente imagen"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                             </button>
                           </>
                         )}
                       </div>
                       
                       {/* Indicadores de puntos */}
                       {productImages.length > 1 && (
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                           {productImages.map((_, index) => (
                             <button
                               key={index}
                               onClick={() => setCurrentImageIndex({ ...currentImageIndex, [product.id]: index })}
                               className={`h-2 rounded-full transition-all ${
                                 index === currentIndex
                                   ? 'w-8 bg-gold'
                                   : 'w-2 bg-gold/30 hover:bg-gold/50'
                               }`}
                               aria-label={`Ir a imagen ${index + 1}`}
                             />
                           ))}
                         </div>
                       )}
                     </>
                   ) : (
                     // Placeholder para productos sin imagen
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="text-8xl opacity-20 text-cream/30">🧁</div>
                     </div>
                   )}
                 </div>
                 
                 {/* Título y Descripción - Dentro de la columna izquierda */}
                 <div className="p-6 lg:p-8 flex flex-col flex-grow">
                   <h3 className="font-display text-2xl md:text-3xl text-cream mb-3 font-bold">
                     {product.name}
                   </h3>
                   <p className="text-base text-cream/70 leading-relaxed">
                     {product.description}
                   </p>
                 </div>
               </div>

               {/* Columna Derecha - Atributos, Cantidad, Notas, Precio, Botón (Mobile: abajo, Desktop: derecha) */}
               <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col flex-grow space-y-5 order-2 lg:order-2">
 
                 {/* Selector de Tamaño */}
                 {product.sizes && (
                   <div>
                     <label className="block text-sm font-medium text-cream mb-3">
                       Tamaño
                     </label>
                     <div className="flex flex-wrap gap-3">
                       {product.sizes.map((sizeOption) => (
                         <button
                           key={sizeOption.size}
                           onClick={() => setSelectedSizes({ ...selectedSizes, [productId]: sizeOption.size })}
                           className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                             selectedSize === sizeOption.size
                               ? 'bg-gold text-chocolate border border-gold shadow-lg'
                               : 'bg-cream/10 border border-gold/30 text-cream hover:border-gold hover:bg-gold/10'
                           }`}
                         >
                           {sizeOption.size.charAt(0).toUpperCase() + sizeOption.size.slice(1)}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Selector de Cantidad */}
                 <div>
                   <label className="block text-sm font-medium text-cream mb-3">
                     Cantidad
                   </label>
                   <div className="flex items-center gap-4">
                     <button
                       onClick={() => setQuantities({ ...quantities, [productId]: Math.max(1, quantity - 1) })}
                       className="w-11 h-11 rounded-full bg-cream/10 border border-gold/20 text-cream hover:bg-cream/15 active:scale-95 transition-all"
                       aria-label="Disminuir cantidad"
                     >
                       −
                     </button>
                     <span className="min-w-[60px] text-center text-2xl font-bold text-cream">
                       {quantity}
                     </span>
                     <button
                       onClick={() => setQuantities({ ...quantities, [productId]: quantity + 1 })}
                       className="w-11 h-11 rounded-full bg-cream/10 border border-gold/20 text-cream hover:bg-cream/15 active:scale-95 transition-all"
                       aria-label="Aumentar cantidad"
                     >
                       +
                     </button>
                   </div>
                 </div>

                 {/* Notas opcionales */}
                 <div>
                   <label className="block text-sm font-medium text-cream mb-3">
                     Notas (opcional)
                   </label>
                   <input
                     type="text"
                     value={notes[productId] || ''}
                     onChange={(e) => setNotes({ ...notes, [productId]: e.target.value })}
                     placeholder="Ej: Sin nueces..."
                     className="w-full px-4 py-2 bg-cream/10 border border-gold/30 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-cream placeholder-cream/50 text-sm"
                   />
                 </div>

                 {/* Spacer para empujar precio y botón al fondo */}
                 <div className="flex-grow"></div>

                 {/* Precio y Botón - Siempre al fondo */}
                 <div className="space-y-4 pt-4 border-t border-gold/20 relative">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-cream/70">Precio:</span>
                     <span className="text-3xl font-display font-bold text-gold">
                       {formatPrice(price)}
                     </span>
                   </div>

                   <div className="relative">
                     <button
                       onClick={() => handleAddProduct(product)}
                       className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 relative overflow-hidden ${
                         addedProducts[productId]
                           ? 'bg-green-500 hover:bg-green-600 text-white scale-105'
                           : 'bg-gold hover:bg-gold-deep text-chocolate hover:scale-105 hover:shadow-xl'
                       }`}
                     >
                       {addedProducts[productId] ? (
                         <span className="flex items-center justify-center gap-2">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                           </svg>
                           ¡Agregado!
                         </span>
                       ) : (
                         'Agregar al Pedido'
                       )}
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   );
 }