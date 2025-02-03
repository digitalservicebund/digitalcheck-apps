import { devices, PlaywrightTestConfig } from "@playwright/test";

export const allProjects = [
  {
    name: "Desktop Chrome",
    use: {
      ...devices["Desktop Chrome"],
      channel: "chrome",
    },
  },
  {
    name: "Desktop Firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  {
    name: "Desktop Safari",
    use: { ...devices["Desktop Safari"] },
  },
  {
    name: "Desktop Edge",
    use: { ...devices["Desktop Edge"] },
  },
  {
    name: "Mobile Chrome",
    use: { ...devices["Pixel 7"] },
  },
  {
    name: "Mobile Safari",
    use: { ...devices["iPhone 14 Pro"] },
  },
  {
    name: "Tablet Chrome",
    use: { ...devices["Galaxy Tab S4 landscape"] },
  },
  {
    name: "Tablet Safari",
    use: { ...devices["iPad Pro 11 landscape"] },
  },
];

const defaultProjects = allProjects.filter(
  (project) => project.name === "Desktop Chrome",
);

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI, // Fail the build on CI if test.only is present
  retries: process.env.CI ? 1 : 0, // Retry on CI only
  fullyParallel: true,
  use: {
    viewport: { width: 1280, height: 720 },
    acceptDownloads: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  reporter: [
    [process.env.CI ? "github" : "list"],
    [
      "html",
      {
        outputFolder: "./playwright-report",
        open: process.env.CI ? "never" : "on-failure",
      },
    ],
  ],
  projects: defaultProjects,
};

export default config;
