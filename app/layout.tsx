import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sabor de Emociones - Postres Artesanales en Sanford | Tres Leches',
  description: 'Postres artesanales hechos con amor en Sanford. Tres Leches, flan y muffins frescos. Ordena en línea y disfruta del sabor de las emociones.',
  keywords: 'postres en Sanford, tres leches en Sanford, repostería artesanal en Sanford, postres artesanales, dulces caseros Sanford',
  authors: [{ name: 'Ivis Ruiz' }],
  openGraph: {
    title: 'Sabor de Emociones - Postres Artesanales en Sanford',
    description: 'Postres artesanales hechos con amor. Tres Leches, flan y muffins frescos.',
    type: 'website',
    locale: 'es_US',
    siteName: 'Sabor de Emociones',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabor de Emociones - Postres Artesanales en Sanford',
    description: 'Postres artesanales hechos con amor. Tres Leches, flan y muffins frescos.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

