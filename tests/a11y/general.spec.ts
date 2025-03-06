import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import allRoutes from "~/resources/allRoutes";
import { ROUTE_PRINCIPLES, ROUTE_SUPPORT } from "~/resources/staticRoutes";

test.describe.configure({ mode: "parallel" });

test.describe("basic example a11y test", () => {
  allRoutes
    .filter(
      (allRoute) =>
        !allRoute.url.endsWith(".pdf") &&
        !allRoute.url.endsWith(ROUTE_SUPPORT.url),
    )
    .forEach((route) => {
      test(`check a11y of ${route.title}`, async ({ page }) => {
        // Listen for redirects and update URL if needed
        const response = await page.goto(route.url);

        if (
          (response !== null && response.status() === 302) ||
          (response !== null && response.status() === 301)
        ) {
          const redirectedUrl = response.headers()["location"];
          await page.goto(redirectedUrl);
        }

        const accessibilityResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityResults.violations).toEqual([]);
      });
    });

  test("check a11y of example pages", async ({ page }) => {
    await page.goto(
      `${ROUTE_PRINCIPLES.url}/digitale-kommunikation-sicherstellen`,
    );

    const principleScanResults = await new AxeBuilder({ page }).analyze();
    expect(principleScanResults.violations).toEqual([]);

    // get URL of first regelung from page
    const regelungUrl = await page.getAttribute(
      '[data-testid="regelung-on-prinzip"] a',
      "href",
    );
    expect(regelungUrl).not.toBeNull();

    if (regelungUrl !== null) {
      await page.goto(regelungUrl);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
