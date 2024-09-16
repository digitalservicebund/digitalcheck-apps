import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import * as allRoutes from "routes/index";

test.describe("basic example a11y test", () => {
  test("check a11y of all routes", async ({ page }) => {
    for (const route of Object.values(allRoutes)) {
      await page.goto(route);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      console.log("Checking A11Y on route:", route);
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
