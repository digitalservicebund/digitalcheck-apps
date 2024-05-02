/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  plugins: [require("@digitalservice4germany/angie")],
  theme: {
    extend: {
      fontFamily: {
        sans: "BundesSansWeb",
      },
    },
  },
  corePlugins: {
    container: false,
  },
};
