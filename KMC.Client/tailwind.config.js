/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover:   '#4338CA',
          light:   '#EEF2FF',
          dark:    '#6366F1',
          'dark-hover': '#818CF8',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          hover:   '#D97706',
          dark:    '#FBBF24',
          'dark-hover': '#FCD34D',
        },
        accent: {
          cyan:    '#06B6D4',
          rose:    '#F43F5E',
          emerald: '#10B981',
          violet:  '#8B5CF6',
        },
        surface: {
          DEFAULT:  '#FFFFFF',
          subtle:   '#F1F5F9',
          app:      '#F8FAFC',
          dark:     '#111827',
          'dark-subtle': '#1E293B',
          'dark-app': '#090D16',
        },
      },
      boxShadow: {
        'glow':      '0 0 25px rgba(79, 70, 229, 0.25)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.3)',
        'glow-dark': '0 0 30px rgba(99, 102, 241, 0.35)',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '28px',
      },
      backgroundImage: {
        'grad-hero': 'linear-gradient(160deg, rgba(9,13,30,0.88) 0%, rgba(30,27,75,0.82) 50%, rgba(79,70,229,0.55) 100%)',
        'grad-hero-dark': 'linear-gradient(160deg, rgba(9,13,22,0.92) 0%, rgba(17,24,39,0.88) 45%, rgba(30,27,75,0.82) 80%, rgba(49,46,129,0.75) 100%)',
        'grad-primary': 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)',
        'grad-secondary': 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
