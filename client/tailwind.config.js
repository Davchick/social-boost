/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8FAFC',
        secondary: '#FFFFFF',
        tertiary: '#F8F9FF',
        'text-primary': '#1E293B',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
        accent: '#6366F1',
        'accent-secondary': '#8B5CF6',
        'accent-tertiary': '#A855F7',
        'accent-cyan': '#06B6D4',
        'accent-pink': '#EC4899',
        'accent-orange': '#F97316',
        border: '#E2E8F0',
        'border-light': '#CBD5E1',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1280px',
        'container-wide': '1600px',
      },
      borderRadius: {
        'pill': '9999px',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 8px 24px -12px rgba(99, 102, 241, 0.35)',
        'glow-pink': '0 8px 24px -12px rgba(236, 72, 153, 0.3)',
        'glow-cyan': '0 8px 24px -12px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 8px 24px -12px rgba(139, 92, 246, 0.35)',
        'glow-orange': '0 8px 24px -12px rgba(249, 115, 22, 0.3)',
        'card': '0 8px 24px rgba(30, 41, 59, 0.08)',
        'card-hover': '0 12px 30px rgba(30, 41, 59, 0.12)',
        'card-accent': '0 8px 24px rgba(99, 102, 241, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-accent-soft': 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'blur-in': 'blurIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
}
