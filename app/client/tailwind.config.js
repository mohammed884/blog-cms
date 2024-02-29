/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '40px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'tall': {
        'raw': `only screen and (max-height: 960px) and (max-width: 480px)`
      },
      'wide': {
        'raw': `only screen and (max-height: 480px) and (max-width: 960px)`
      },
      'portrait': {
        'raw': '(orientation: portrait)'
      },
      'landscape': {
        'raw': '(orientation: landscape)'
      },
    },
    extend: {
      colors: {
        off_white: "#fefefe",
        dark_green: "#606C38",
        light_green: "#7c9a82",
        light_beige: "#FEFAE0",
        light_gray: "#f2f2f2"
      }
    },
  },
  plugins: [],
}
//old off_white #fefefe
//new #f3f4f6