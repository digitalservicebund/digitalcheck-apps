import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import allRoutes from "resources/allRoutes";

test.describe("basic example a11y test", () => {
  // eslint-disable-next-line playwright/expect-expect
  test("check a11y of all routes", async ({ page }) => {
    for await (const route of allRoutes) {
      await page.goto(route.url);
      await injectAxe(page);
      await checkA11y(page);
    }
  });
});
