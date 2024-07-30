/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../shared/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("../../tailwind.preset.js")],
};
