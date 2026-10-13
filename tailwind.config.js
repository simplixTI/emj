/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1F2F',
          DEFAULT: '#102F46',
          800: '#102F46',
          700: '#1B4463',
          600: '#2A5A7E',
          200: '#A8C0D4',
        },
        red: {
          DEFAULT: '#E53E55',
          500: '#E53E55',
          600: '#C72F44',
        },
        gray: {
          50: '#F3F5F7',
          200: '#DDE3E9',
          500: '#5F6B76',
        },
        ink: '#0A1F2F',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Oswald', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.04em', display: '-0.02em' },
      maxWidth: { measure: '68ch', shell: '88rem' },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'draw-line': { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        'marquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
};
