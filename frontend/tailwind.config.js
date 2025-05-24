/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: {
            light: '#f5f5f5',  // Light grey for light mode
            dark: '#1a1a1a',   // Dark grey for dark mode
          }
        }
      },
    },
    darkMode: 'class', // Add this if using dark mode toggle
    plugins: [],
  }
  