/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        rozha: ['"Rozha One"', 'serif'],
      },
      colors: {
        primary: "#1e3a8a", // Dark Blue (Like screenshot)
        secondary: "#3b82f6",
        accent: "#f59e0b", // Orange/Gold
      }
    },
  },
  plugins: [],
}