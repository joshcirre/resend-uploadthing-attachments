// @ts-check
const { withUt } = require("uploadthing/tw");

/** @type {import('tailwindcss').Config} */
module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [require("tailwindcss-animate")],
});
