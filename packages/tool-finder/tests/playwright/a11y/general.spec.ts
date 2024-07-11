import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import * as allRoutes from "routes";

test.describe("basic example a11y test", () => {
  test("check a11y of all routes", async ({ page }) => {
    for (const route of Object.values(allRoutes)) {
      await page.goto(route);
      await injectAxe(page);
      console.log("Checking A11Y on route:", route);
      await checkA11y(page);
    }
  });
});
