/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'index.html'],
  theme: {
    extend: {
      colors: {
        gray: {
          999: '#020410'
        }
      }
    }
  },
  plugins: [],
}
