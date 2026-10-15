/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#F4F0E8',
          100: '#EDE8DF',
          200: '#D7CEC2',
          400: '#9A7852',
          700: '#5a3e2b',
          800: '#3d2a1e',
          900: '#302722',
          950: '#1a1410',
        },
        gold: {
          300: '#c4a97a',
          400: '#b09060',
          500: '#9A7852',
          600: '#7d5f3a',
          700: '#614829',
        },
        cream: {
          50:  '#FFFDF8',
          100: '#F4F0E8',
          200: '#EDE8DF',
          300: '#D7CEC2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
