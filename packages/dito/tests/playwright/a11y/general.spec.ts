import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import allRoutes from "resources/allRoutes";

test.describe("basic example a11y test", () => {
  test("check a11y of all routes", async ({ page }) => {
    for await (const route of allRoutes.filter(
      (allRoute) => !allRoute.url.endsWith(".pdf"),
    )) {
      await page.goto(route.url);
      await injectAxe(page);
      await checkA11y(page);
    }
  });
});
