/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.custom-class': {
          color: 'blue',
        },
      });
    })
  ],
}

