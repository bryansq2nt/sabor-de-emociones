/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chocolate: '#1B1511',
        gold: '#E7A844',
        'gold-deep': '#A26D49',
        cream: '#F8D5A9',
        coffee: '#5E4227',
        rose: '#E3746D',
        mauve: '#A55F7E',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

