/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          primary: '#2E7D32',
          secondary: '#4CAF50',
          accent: '#8BC34A',
          highlight: '#F4C430',
          dark: '#123C25',
          deep: '#0B3D2E',
          bg: '#F5FAF5',
          soft: '#E8F5E9',
          text: '#102A1B',
          muted: '#52635A',
          border: '#DCE8DE',
        },
        brand: {
          50: '#f0fdf4',
          100: '#e8f5e9',
          200: '#c8e6c9',
          300: '#a5d6a7',
          400: '#81c784',
          500: '#4caf50',
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#123c25',
          900: '#0b3d2e',
          950: '#052e16',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 2px 8px -2px rgba(18, 60, 37, 0.06), 0 1px 4px -1px rgba(18, 60, 37, 0.04)',
        'eco-md': '0 6px 20px -4px rgba(18, 60, 37, 0.08), 0 2px 6px -2px rgba(18, 60, 37, 0.04)',
        'eco-lg': '0 12px 32px -6px rgba(18, 60, 37, 0.12), 0 4px 12px -2px rgba(18, 60, 37, 0.06)',
      },
    },
  },
  plugins: [],
}
