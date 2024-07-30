import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import * as allRoutes from "routes";

test.describe("basic example a11y test", () => {
  for (const route of Object.values(allRoutes)) {
    test(`check a11y of route: ${route}`, async ({ page }) => {
      await page.goto(route);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
