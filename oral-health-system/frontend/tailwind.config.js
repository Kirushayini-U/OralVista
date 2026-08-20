/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbfa',
          100: '#d4f3f1',
          200: '#aee6e2',
          300: '#78d2cc',
          400: '#43b3ac',
          500: '#279791',
          600: '#1b7a75',
          700: '#19625f',
          800: '#194f4d',
          900: '#194241',
        },
        ink: '#132523',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,37,35,0.06), 0 1px 12px rgba(19,37,35,0.06)',
      }
    },
  },
  plugins: [],
}
