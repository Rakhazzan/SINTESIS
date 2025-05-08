/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Keep dark mode class for potential future use or specific elements
  content: [
    "./index.html",
    ".//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom themes (example colors)
        aurora: {
          background: '#2A003B',
          surface: '#4A148C',
          primary: '#E040FB',
          secondary: '#EA80FC',
          text: '#F3E5F5',
          accent: '#FF8A80',
        },
        ocean: {
          background: '#0D47A1',
          surface: '#1565C0',
          primary: '#4FC3F7',
          secondary: '#81D4FA',
          text: '#E1F5FE',
          accent: '#FFAB40',
        },
        forest: {
          background: '#1B5E20',
          surface: '#2E7D32',
          primary: '#8BC34A',
          secondary: '#C5E1A5',
          text: '#E8F5E9',
          accent: '#FFEB3B',
        },
         // Default Light theme colors (retained for 'light' theme option)
        light: {
          background: '#FFFFFF',
          surface: '#F9FAFB',
          primary: '#3B82F6',
          secondary: '#60A5FA',
          text: '#1F2937',
          accent: '#EF4444',
        },
        // New base colors for the modern theme
        'modern-bg': '#030014',
        'modern-primary': '#6366f1',
        'modern-secondary': '#a855f7', // Fixed: Was missing the last digit '7'
        'modern-accent': '#e2d3fd',
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