import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import * as allRoutes from "../../src/routes";

test.describe("basic example a11y test", () => {
  // eslint-disable-next-line playwright/expect-expect
  test("check a11y of all routes", async ({ page }) => {
    for (const route of Object.values(allRoutes)) {
      await page.goto(route);
      await injectAxe(page);
      await checkA11y(page);
    }
  });
});
