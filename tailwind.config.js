/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#F5F5F7',
        'text-primary': '#1D1D1F',
        'text-secondary': '#6E6E73',
        accent: '#0071E3',
        'accent-hover': '#0077ED',
        border: '#D2D2D7',
        success: '#34C759',
        error: '#FF3B30',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'pill': '980px',
        '20': '20px',
        '12': '12px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
