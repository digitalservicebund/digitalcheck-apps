/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../shared/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("../../tailwind.preset.js")],
};
