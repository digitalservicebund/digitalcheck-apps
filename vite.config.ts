import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    !process.env.VITEST &&
      remix({
        future: {
          unstable_optimizeDeps: true,
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
        },
      }),
    tsconfigPaths(),
  ],
  build: {
    target: "ES2022",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest-setup.ts"],
    include: ["app/**/*.spec.ts*"],
  },
});
