import { vitePlugin as remix } from "@remix-run/dev";
import * as path from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${path.resolve(__dirname, "../shared/public")}/*`,
          dest: "./",
        },
      ],
    }),
    remix(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest-setup.ts"],
    include: ["app/**/*.spec.ts"],
  },
});
