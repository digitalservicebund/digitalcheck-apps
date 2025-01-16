import { devices, PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import baseConfig from "../../../playwright.config-base";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../", ".env.test") });

const desktopViewport = { width: 1200, height: 4800 };

const config: PlaywrightTestConfig = {
  ...baseConfig,
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: desktopViewport,
      },
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"], viewport: desktopViewport },
    },
    {
      name: "Desktop Safari",
      use: { ...devices["Desktop Safari"], viewport: desktopViewport },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 7"],
        viewport: { ...devices["Pixel 7"].viewport, height: 3200 },
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 14 Pro"],
        viewport: { ...devices["iPhone 14 Pro"].viewport, height: 3200 },
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 5172",
    port: 5172,
    timeout: parseInt(process.env.WAIT_ON_TIMEOUT ?? `${5 * 1000}`),
  },
};

export default config;
