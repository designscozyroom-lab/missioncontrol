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
          300: '#9A9A9A',
          100: '#E5E5E5',
        },
        brick: {
          600: '#C53030',
          500: '#E53E3E',
          400: '#FC8181',
        },
        gold: {
          500: '#D69E2E',
          400: '#ECC94B',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
