import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "../shared/public",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../shared"),
    },
  },
  plugins: [remix()],
});
