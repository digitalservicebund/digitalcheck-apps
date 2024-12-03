import { expect, test } from "@playwright/test";
import { ROUTE_LAWS, ROUTE_PRINCIPLES } from "resources/staticRoutes";

const principles = [
  "digitale-kommunikation-sicherstellen",
  "wiederverwendung-von-daten-und-standards-ermoeglichen",
  "datenschutz-und-informationssicherheit-gewaehrleisten",
  "klare-regelungen-fuer-eine-digitale-ausfuehrung-finden",
  "automatisierung-ermoeglichen",
];
test.setTimeout(15000);

test.describe("Digitaltauglichkeit main functionality", () => {
  test.describe("Principle-specific tests", () => {
    for (const principle of principles) {
      test(`displays detailed information for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

        // Wait for navigation to complete
        await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

        // Wait for main content to be visible
        const mainContent = page.getByRole("main");
        await mainContent.waitFor({ state: "visible", timeout: 10000 });

        // Verify content with extended timeout
        await expect(mainContent).toContainText(
          `Prinzip ${principles.indexOf(principle) + 1} in Regelungstexten`,
          { timeout: 5000 },
        );
      });

      test(`renders navigation links for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

        // Wait for navigation to complete
        await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

        const nextPrincipleIndex = principles.indexOf(principle) + 1;
        if (nextPrincipleIndex < principles.length) {
          const nextPrincipleLink = page.getByRole("link", {
            name: `Prinzip ${nextPrincipleIndex + 1}`,
          });

          // Explicit wait for link to be interactive
          await nextPrincipleLink.waitFor({ state: "visible", timeout: 5000 });

          // Ensure link is enabled before clicking
          await expect(nextPrincipleLink).toBeEnabled({ timeout: 5000 });

          // Click and wait for navigation
          await Promise.all([
            page.waitForURL(
              `${ROUTE_PRINCIPLES.url}/${principles[nextPrincipleIndex]}`,
            ),
            nextPrincipleLink.click(),
          ]);
        }
      });
    }
  });
});

test.describe("Digitaltauglichkeit Prinzipien Detail", () => {
  for (const principle of principles) {
    test(`displays paragraphs with relevant principles for: ${principle}`, async ({
      page,
    }) => {
      await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

      // Wait for navigation to complete
      await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

      // Wait for paragraphs to be present
      const paragraphs = page.locator(".rich-text > div");
      await paragraphs.first().waitFor({ state: "visible", timeout: 5000 });

      // Check paragraph count
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(0);

      // Wait for highlights to be present
      const highlights = page.locator("mark");
      await highlights.first().waitFor({ state: "visible", timeout: 5000 });

      // Check highlight count
      const highlightCount = await highlights.count();
      expect(highlightCount).toBeGreaterThan(0);
    });

    test(`navigates to laws associated with principle: ${principle}`, async ({
      page,
    }) => {
      await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

      // Wait for navigation to complete
      await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

      // Find law links
      const lawLinks = page.locator(`a[href^="${ROUTE_LAWS.url}"]`);

      // Wait for first law link to be visible
      await lawLinks.first().waitFor({ state: "visible", timeout: 5000 });

      // Click first law link and wait for navigation
      await Promise.all([
        page.waitForURL(new RegExp(`${ROUTE_LAWS.url}/.+`)),
        lawLinks.first().click(),
      ]);
    });
  }
});
