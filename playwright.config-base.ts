import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  fullyParallel: true,
  timeout: 10000, // 10 seconds
  forbidOnly: !!process.env.CI, // Fail the build on CI if test.only is present
  retries: process.env.CI ? 1 : 0, // Retry on CI only
  workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI
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
};

export default config;
