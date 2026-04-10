/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cardiff: {
          red: '#D50032', // Cardiff University Red
          dark: '#231F20', // Cardiff University Black
          grey: '#A7A8AA', // Cardiff University Grey
          light: '#F5F5F5', // Cardiff University Light Gray
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
