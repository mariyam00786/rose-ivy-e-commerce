/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D1AFA1',
        'primary-dark': '#b48877',
        'brand-black': '#1a1a1a',
        'brand-dark': '#212121',
        'brand-gray': '#555555',
        'brand-light-gray': '#888888',
        'brand-border': '#e8e0db',
        'brand-light': '#f9f5f3',
        'brand-red': '#e74c3c',
        'brand-rose': '#D1AFA1',
      },
      fontFamily: {
        sans: ['Inter', 'Raleway', 'sans-serif'],
        serif: ['Raleway', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        wider: '0.15em',
        wide: '0.1em',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      maxWidth: {
        'site': '1340px',
      },
    },
  },
  plugins: [],
};
