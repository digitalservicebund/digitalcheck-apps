import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import baseConfig from "../../../../playwright.config-base";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../..", ".env.test") });

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: parseInt(process.env.WAIT_ON_TIMEOUT ?? `${5 * 1000}`),
    reuseExistingServer: true,
  },
};

export default config;
