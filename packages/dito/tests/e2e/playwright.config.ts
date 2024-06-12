import { devices, PlaywrightTestConfig } from "@playwright/test";

const timeout = parseInt(process.env.WAIT_ON_TIMEOUT ?? `${5 * 1000}`);

const config: PlaywrightTestConfig = {
  testDir: ".",
  timeout: 10000,
  retries: process.env.CI === "true" ? 1 : 0,
  use: {
    viewport: { width: 1280, height: 720 },
    acceptDownloads: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  reporter: [
    [process.env.CI ? "github" : "list"],
    ["html", { outputFolder: "./playwright-report" }],
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run build && npm start",
    port: 3000,
    timeout,
    reuseExistingServer: true,
  },
};

export default config;
