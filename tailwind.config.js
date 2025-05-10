/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Keep dark mode class for potential future use or specific elements
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',     // Extra small devices (phones)
      'sm': '640px',     // Small devices (large phones, small tablets)
      'md': '768px',     // Medium devices (tablets)
      'lg': '1024px',    // Large devices (laptops/desktops)
      'xl': '1280px',    // Extra large devices (large laptops, desktops)
      '2xl': '1536px',   // Very large screens and beyond
    },
    extend: {
      spacing: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '5/6': '83.333333%',
        'full': '100%',
      },
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
        'modern-black': '#030014',
        'modern-primary': '#6366f1',
        'modern-secondary': '#a855f7',
        'modern-accent': '#e2d3fd',
      },
      animation: {
        blob: 'blob 7s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Add Poppins
      },
      fontSize: {
        'xxs': '.65rem',
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'screen': '100vh',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
      },
      maxHeight: {
        '0': '0',
        'full': '100%',
        'screen': '100vh',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
      },
      height: theme => ({
        'screen-1/2': '50vh',
        'screen-1/3': '33.333333vh',
        'screen-2/3': '66.666667vh',
        'screen-1/4': '25vh',
        'screen-3/4': '75vh',
        ...theme('spacing'),
      }),
      width: theme => ({
        'screen-1/2': '50vw',
        'screen-1/3': '33.333333vw',
        'screen-2/3': '66.666667vw',
        'screen-1/4': '25vw',
        'screen-3/4': '75vw',
        ...theme('spacing'),
      }),
      scale: {
        '0': '0',
        '25': '.25',
        '50': '.5',
        '75': '.75',
        '90': '.9',
        '95': '.95',
        '100': '1',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
        '150': '1.5',
        '175': '1.75',
        '200': '2',
      },
      backdropBlur: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      aspectRatio: {
        '1': '1',
        '2/1': '2 / 1',
        '16/9': '16 / 9',
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '1/2': '1 / 2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Add forms plugin for better form styling control
    function ({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(100, 116, 139, 0.5)',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(100, 116, 139, 0.7)',
          },
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
        '.transition-all-200': {
          transition: 'all 200ms ease-in-out',
        },
        '.transition-all-300': {
          transition: 'all 300ms ease-in-out',
        },
        '.transition-all-500': {
          transition: 'all 500ms ease-in-out',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-effect-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};