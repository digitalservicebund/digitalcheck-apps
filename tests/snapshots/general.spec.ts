import { expect, test } from "@playwright/test";

import allRoutes from "~/resources/allRoutes";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.describe("compare snapshots", () => {
  allRoutes
    .filter((allRoute) => !allRoute.url.endsWith(".pdf"))
    .forEach((route) => {
      test(route.title, async ({ page }) => {
        // Listen for redirects and update URL if needed
        const response = await page.goto(route.url);

        if (
          (response !== null && response.status() === 302) ||
          (response !== null && response.status() === 301)
        ) {
          const redirectedUrl = response.headers()["location"];
          await page.goto(redirectedUrl);
        }

        // wait to finish rendering
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        // wait to make sure the page is fully rendered
        await wait(100);

        await expect(page).toHaveScreenshot();
      });
    });
});
