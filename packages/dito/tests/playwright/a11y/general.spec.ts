import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import allRoutes from "resources/allRoutes";
import { ROUTE_SUPPORT } from "resources/staticRoutes";

test.describe("basic example a11y test", () => {
  test.setTimeout(60000);
  test("check a11y of all routes", async ({ page }) => {
    for (const route of allRoutes.filter(
      (allRoute) =>
        !allRoute.url.endsWith(".pdf") &&
        !allRoute.url.endsWith(ROUTE_SUPPORT.url),
    )) {
      // Listen for redirects and update URL if needed
      const response = await page.goto(route.url);

      if (
        (response !== null && response.status() === 302) ||
        (response !== null && response.status() === 301)
      ) {
        const redirectedUrl = response.headers()["location"];
        await page.goto(redirectedUrl);
      }

      await page.goto(route.url);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      console.log("Checking A11Y on route:", route.url);
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
