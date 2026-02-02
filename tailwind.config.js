/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#D62828',
        'brand-green': '#25D366',
        'brand-black': '#050505',
        'brand-dark': '#0A0A0A',
        'brand-gray': '#9CA3AF',
      },
      fontFamily: {
        heading: ['Teko', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}