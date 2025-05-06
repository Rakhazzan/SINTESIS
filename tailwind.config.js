/**  @type {import('tailwindcss').Config} */
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
      },
    },
  },
  plugins: [],
}