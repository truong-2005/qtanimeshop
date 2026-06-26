/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cinzel: ['"Cinzel Decorative"', 'serif'],
      },
      colors: {
        'brand-dark': '#0c0b1a',
        'brand-purple': '#360c4f',
        'brand-pink': '#b4267b',
      }
    },
  },
  plugins: [],
}
