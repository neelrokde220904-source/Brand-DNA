/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'hero-sub': 'hsl(var(--hero-sub))',
        card: 'hsl(var(--card))',
        accent: 'hsl(var(--accent))',
      },
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        display: ['General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
