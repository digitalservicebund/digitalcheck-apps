import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import allRoutes from "resources/allRoutes";

test.describe("basic example a11y test", () => {
  for (const route of allRoutes.filter(
    (allRoute) => !allRoute.url.endsWith(".pdf"),
  )) {
    test(`check a11y of all route: ${route.url}`, async ({ page }) => {
      await page.goto(route.url);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
