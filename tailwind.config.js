/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primary dark background — exact match from UI ──────────────
        navy: {
          50:   '#f2f4f8',
          100:  '#e2e8f2',
          200:  '#c4cfe5',
          300:  '#8fa3c8',
          400:  '#5a77ab',
          500:  '#2e5090',
          600:  '#1d3a72',
          700:  '#162d5c',
          800:  '#0f2040',
          900:  '#0A1628',   // main dark bg
          950:  '#060d18',   // deepest bg (footer)
        },
        // ── Gold accent — exact match from UI ─────────────────────────
        gold: {
          100: '#f7f0dc',
          200: '#eed99b',
          300: '#e4c46a',
          400: '#d4aa3a',
          500: '#C9A233',   // primary gold — buttons, highlights
          600: '#a8841f',
          700: '#856610',
          800: '#5c4608',
        },
        // ── Warm off-white — used for page bg and cards ───────────────
        cream: {
          50:  '#FDFCF8',   // page background
          100: '#F8F7F2',   // card background
          200: '#F0EFE9',   // sidebar / filter bg
          300: '#E8E4DC',   // card border / dividers
          400: '#D4CEBC',   // muted borders
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 2px 12px 0 rgba(10, 22, 40, 0.08)',
        cardHover: '0 8px 32px 0 rgba(10, 22, 40, 0.15)',
        gold:  '0 4px 20px 0 rgba(201, 162, 51, 0.35)',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
