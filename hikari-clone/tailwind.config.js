/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hikari-pink': '#fb7299',
        'hikari-blue': '#00aeec',
      }
    },
  },
  plugins: [],
}