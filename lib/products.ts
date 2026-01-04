export type ProductSize = 'pequeño' | 'mediano' | 'grande';

export interface Product {
  id: string;
  name: string;
  description: string;
  sizes?: {
    size: ProductSize;
    price: number;
  }[];
  fixedPrice?: number;
  image?: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 'tres-leches',
    name: 'Tres Leches',
    description: 'Nuestro postre estrella. Esponjoso, cremoso y con el balance perfecto de dulzura. Hecho con amor y dedicación artesanal.',
    sizes: [
      { size: 'pequeño', price: 25 },
      { size: 'mediano', price: 35 },
      { size: 'grande', price: 50 },
    ],
    featured: true,
  },
  {
    id: 'flan',
    name: 'Flan',
    description: 'Clásico y suave, con caramelo casero. Un postre que siempre reconforta.',
    fixedPrice: 25,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

