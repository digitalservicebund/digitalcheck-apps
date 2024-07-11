import { PlaywrightTestConfig } from "@playwright/test";
import baseConfig from "../../../playwright.config-base";

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
