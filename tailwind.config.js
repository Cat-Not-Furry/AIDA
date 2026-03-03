/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        'secondary-hover': 'var(--secondary-hover)',
        'text-secondary': 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        info: 'var(--info)',
      },
    },
  },
  plugins: [],
};
