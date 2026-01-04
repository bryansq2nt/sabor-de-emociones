# Sabor de Emociones - Landing Page

Landing page única y elegante para **Sabor de Emociones - by Ivis Ruiz**, una marca de postres artesanales en Sanford. Construida con Next.js App Router, TypeScript y Tailwind CSS, con diseño tipo "menú físico elegante" y efectos visuales sutiles.

## 🎨 Características Visuales

- **Diseño tipo menú físico**: Layout elegante con separadores SVG tipo "capas de pastel"
- **Confeti animado**: Efecto sutil de confeti cayendo (optimizado para performance)
- **Fondo oscuro**: Tonos chocolate/espresso inspirados en el logo
- **Separadores orgánicos**: Ondas suaves tipo frosting entre secciones
- **Sin navegación**: Todo en una sola página, scroll fluido
- **Responsive**: Mobile-first, adaptado a todos los dispositivos

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar el Logo

**IMPORTANTE**: Coloca tu logo en la carpeta `/public/`:

```bash
# El logo debe estar en:
/public/logo-sabor-de-emociones.jpeg

# O renombra tu archivo de logo a:
logo-sabor-de-emociones.jpeg
```

El logo se mostrará centrado en el hero de la página. Asegúrate de que sea una imagen cuadrada o casi cuadrada para mejor resultado.

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Nodemailer Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
EMAIL_TO=orders@sabordemociones.com

# Next.js
NEXT_PUBLIC_SITE_URL=https://sabordemociones.com
```

**Para Gmail:**
1. Ve a tu cuenta de Google → Seguridad
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `EMAIL_PASS`

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Deploy en Vercel

### Paso 1: Subir Código

Sube tu código a GitHub, GitLab o Bitbucket.

### Paso 2: Conectar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importa tu repositorio
4. Vercel detectará automáticamente Next.js

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega cada variable del archivo `.env.local`:
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_TO`
   - `NEXT_PUBLIC_SITE_URL`

3. Asegúrate de configurarlas para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Paso 4: Deploy

Vercel desplegará automáticamente. Tu sitio estará disponible en:
- `tu-proyecto.vercel.app` (dominio gratuito)
- O conecta tu dominio personalizado

## ✏️ Personalización

### Cambiar Productos y Precios

Edita `/lib/products.ts`:

```typescript
export const products: Product[] = [
  {
    id: 'tres-leches',
    name: 'Tres Leches',
    description: 'Tu descripción aquí',
    sizes: [
      { size: 'pequeño', price: 25 },
      { size: 'mediano', price: 35 },
      { size: 'grande', price: 50 },
    ],
  },
  // Agrega más productos...
];
```

### Cambiar Textos y Copy

Edita `/lib/content.ts`:

```typescript
export const content = {
  hero: {
    headline: 'Tu headline aquí',
    subheadline: 'Tu subheadline aquí',
  },
  story: {
    title: 'Título de la historia',
    text: `Tu texto aquí...`,
  },
  // ...
};
```

### Cambiar Información de Contacto

Busca las constantes en `app/page.tsx`:

```typescript
const WHATSAPP_NUMBER = '15719103088';
const PHONE_NUMBER = '+15719103088';
```

### Cambiar Colores

Edita `tailwind.config.js`:

```javascript
colors: {
  chocolate: '#1B1511',  // Fondo principal
  gold: '#E7A844',        // Dorado principal
  'gold-deep': '#A26D49', // Dorado profundo
  cream: '#F8D5A9',       // Crema
  coffee: '#5E4227',      // Café (texto)
  rose: '#E3746D',        // Rosa acento
  mauve: '#A55F7E',       // Mauve
}
```

### Ajustar Confeti

Edita `components/ConfettiRain.tsx`:

- Cambiar número de partículas: línea 30 (mobile) y 31 (desktop)
- Cambiar colores: array `COLORS` en línea 8
- Cambiar opacidad: `style={{ opacity: 0.4 }}` en línea 99

## 📁 Estructura del Proyecto

```
sabor-de-emociones/
├── app/
│   ├── api/
│   │   └── order/
│   │       └── route.ts      # API endpoint Nodemailer
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout con metadata SEO
│   ├── page.tsx                # Landing page única
│   ├── robots.ts               # robots.txt
│   └── sitemap.ts              # sitemap.xml
├── components/
│   ├── ConfettiRain.tsx        # Efecto confeti
│   ├── OrderForm.tsx           # Formulario de pedido
│   ├── OrderSummary.tsx        # Resumen del carrito
│   ├── PastelSection.tsx       # Wrapper con separadores SVG
│   └── ProductCards.tsx        # Cards de productos
├── lib/
│   ├── content.ts              # Contenido editable
│   ├── order.ts                # Tipos y formateo de pedidos
│   ├── products.ts             # Catálogo de productos
│   └── whatsapp.ts             # Formateo de mensajes WhatsApp
├── public/
│   └── logo-sabor-de-emociones.jpeg  # Logo (colocar aquí)
└── package.json
```

## 🎯 Funcionalidades

### Pedidos por WhatsApp

- Genera mensaje prellenado con toda la información
- Incluye: nombre, teléfono, productos, total, notas
- Abre WhatsApp Web o App automáticamente

### Pedidos por Email

- Usa Nodemailer para enviar emails
- Formato HTML elegante
- Incluye toda la información del pedido
- Respuestas de éxito/error amigables

### Carrito de Compras

- Agregar productos con tamaño y cantidad
- Notas especiales por producto
- Resumen sticky en desktop
- Resumen al final en mobile
- Editar cantidades y eliminar items

## 🔧 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Ejecutar linter
```

## 🎨 Paleta de Colores

- **Chocolate oscuro**: `#1B1511` - Fondo principal
- **Dorado principal**: `#E7A844` - CTAs y acentos
- **Dorado profundo**: `#A26D49` - Textos destacados
- **Crema suave**: `#F8D5A9` - Fondos secundarios y texto
- **Café medio**: `#5E4227` - Texto (no usado en dark mode)
- **Rosa acento**: `#E3746D` - Acentos emocionales
- **Mauve suave**: `#A55F7E` - Acentos suaves

## 📱 Responsive

- **Mobile**: < 768px - Confeti reducido, resumen al final
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px - Resumen sticky, layout optimizado

## 🔍 SEO

- Metadata completa (title, description, OG tags)
- Sitemap.xml generado automáticamente
- Robots.txt configurado
- Estructura semántica HTML
- Palabras clave locales optimizadas

## ⚡ Performance

- Confeti optimizado (pausa cuando tab no visible)
- Menos partículas en mobile
- Imágenes optimizadas con Next.js Image
- Código tipado con TypeScript
- CSS optimizado con Tailwind

## 🐛 Solución de Problemas

### El logo no se muestra

- Verifica que el archivo esté en `/public/logo-sabor-de-emociones.jpeg`
- Verifica que el nombre del archivo coincida exactamente
- Asegúrate de reiniciar el servidor de desarrollo

### Emails no se envían

- Verifica las variables de entorno en Vercel
- Para Gmail, asegúrate de usar una "App Password", no tu contraseña normal
- Revisa los logs en Vercel para ver errores específicos

### Confeti muy lento en mobile

- Reduce el número de partículas en `ConfettiRain.tsx` línea 30
- Ya está optimizado para pausar cuando el tab no está visible

## 📄 Licencia

Este proyecto es privado y propiedad de Sabor de Emociones - by Ivis Ruiz.

---

**Hecho con 💛 para Sabor de Emociones**
# sabor-de-emociones
