/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  // Use class-based dark mode to allow manual toggling
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        'glass-bg': 'rgba(255, 255, 255, 0.25)',
        'glass-bg-dark': 'rgba(0, 0, 0, 0.25)'
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        glass: '16px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
