/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lomas: {
          red: '#D32F2F',    // Rojo de los botones "Nuevo Alumno"
          black: '#121212',  // Negro de la sidebar
          bg: '#F8F9FA'      // Gris de fondo
        }
      }
    },
  },
  plugins: [],
}