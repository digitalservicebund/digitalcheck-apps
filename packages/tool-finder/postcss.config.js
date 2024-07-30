/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: { config: "./tailwind.config.js" },
    autoprefixer: {},
  },
};

export default config;
