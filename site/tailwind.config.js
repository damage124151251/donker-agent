/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'donker-orange': '#e07a3a',
        'donker-orange-light': '#f4a460',
        'donker-skin': '#d4a574',
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#242424',
        'bg-card': '#2d2d2d',
      },
      fontFamily: {
        'comic': ['"Comic Neue"', '"Comic Sans MS"', 'cursive'],
        'nunito': ['Nunito', 'sans-serif'],
        'pixel': ['VT323', 'monospace'],
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(224, 122, 58, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(224, 122, 58, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
}
