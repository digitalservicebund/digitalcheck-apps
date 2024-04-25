import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/components": path.resolve(__dirname, "../shared/components"),
      "~/services": path.resolve(__dirname, "../shared/services"),
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: {
        tailwindcss: { config: "./tailwind.config.cjs" },
        autoprefixer: {},
      },
    },
  },
});
