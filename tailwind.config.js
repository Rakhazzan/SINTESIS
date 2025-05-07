/**@type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Keep dark mode class for potential future use or specific elements
  content: [
    "./index.html",
    ".//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors for the new modern theme
        'modern-black': '#000000',
        'modern-white': '#FFFFFF',
        'modern-red': '#FF0000',
        'modern-blue': '#0000FF',
        'modern-purple': '#800080',
        // Dynamic accent color using CSS variable
        'modern-accent-dynamic': 'var(--color-accent-primary)',
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Add Poppins
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms'), // Add forms plugin for better form styling control
  ],
}