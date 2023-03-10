/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'index.html'],
  theme: {
    extend: {
      colors: {
        gray: {
          999: '#020410',
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
