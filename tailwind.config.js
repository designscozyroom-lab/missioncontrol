/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FAF8F5',
          200: '#F5F0E8',
        },
        ink: {
          900: '#1A1A1A',
          700: '#3D3D3D',
          500: '#6B6B6B',
          400: '#8A8A8A',
          300: '#B0B0B0',
          200: '#D4D4D4',
          100: '#E8E8E8',
        },
        coral: {
          600: '#C4513D',
          500: '#E8725C',
          400: '#F09A88',
          100: '#FDEAE6',
        },
        gold: {
          500: '#D69E2E',
          400: '#ECC94B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
