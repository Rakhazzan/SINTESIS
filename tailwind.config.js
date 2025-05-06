/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode based on class
  content: [
    "./index.html",
    ".//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark mode palette (example)
        dark: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#00BFA6',
          secondary: '#80CBC4',
          text: '#E0E0E0',
          accent: '#FF5252',
        },
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
      },
    },
  },
  plugins: [],
}