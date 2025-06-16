/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f7941d',
          light: '#fbbf77',
          dark: '#d97706',
        },
      }
    },
  },
  plugins: [],
}
