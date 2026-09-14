/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f0f11',
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#ff5c35',
          600: '#e04722',
          700: '#b83416',
          800: '#724638',
          900: '#341a11',
          DEFAULT: '#ff5c35'
        },
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(0,0,0,0.5)',
        'glow': '0 0 25px rgba(255, 92, 53, 0.35)',
        'glow-subtle': '0 0 15px rgba(255, 92, 53, 0.18)',
      },
    },
  },
  plugins: [],
};
