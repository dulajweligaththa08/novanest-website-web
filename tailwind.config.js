/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*navy: {
          

          50:  '#F1F8F3',
          100: '#DCEFE1',
          200: '#B9DEC3',
          400: '#72B98A',
          700: '#216E3A',
          800: '#18552D',
          900: '#0B2A18',
          950: '#06150C',
        },*/
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          400: '#8193f8',
          700: '#1e3a8a',
          800: '#162d6e',
          900: '#0A1628',
          950: '#060d1a',
        },
        gold: {
          300: '#f0d080',
          400: '#e0b84a',
          500: '#C9A84C',
          600: '#a8882e',
          700: '#876a18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
