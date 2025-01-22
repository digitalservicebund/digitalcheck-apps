import { devices, PlaywrightTestConfig } from "@playwright/test";

const desktopViewport = { width: 1200, height: 4800 };

const projects = [
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
  {
    name: "Tablet Chrome",
    use: {
      ...devices["Galaxy Tab S4 landscape"],
      viewport: { ...devices["Galaxy Tab S4 landscape"].viewport },
    },
  },
  {
    name: "Tablet Safari",
    use: {
      ...devices["iPad Pro 11 landscape"],
      viewport: { ...devices["iPad Pro 11 landscape"].viewport },
    },
  },
];

export const projectsCi = projects.filter(
  (project) => project.name === "Desktop Chrome",
);

const config: PlaywrightTestConfig = {
  workers: 4,
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // Fail the build on CI if test.only is present
  retries: process.env.CI ? 1 : 0, // Retry on CI only
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
  projects: projects,
};

export default config;
