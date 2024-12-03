import { expect, test } from "@playwright/test";
import { ROUTE_LAWS, ROUTE_PRINCIPLES } from "resources/staticRoutes";

const principles = [
  "digitale-kommunikation-sicherstellen",
  "wiederverwendung-von-daten-und-standards-ermoeglichen",
  "datenschutz-und-informationssicherheit-gewaehrleisten",
  "klare-regelungen-fuer-eine-digitale-ausfuehrung-finden",
  "automatisierung-ermoeglichen",
];

test.describe("Digitaltauglichkeit main functionality", () => {
  test.describe("Principle-specific tests", () => {
    for (const principle of principles) {
      test(`displays detailed information for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);
        await expect(page.getByRole("main")).toContainText(
          `Prinzip ${principles.indexOf(principle) + 1} in Regelungstexten`,
        );
      });

      test(`renders navigation links for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

        const nextPrincipleIndex = principles.indexOf(principle) + 1;
        if (nextPrincipleIndex < principles.length) {
          const nextPrincipleLink = page.getByRole("link", {
            name: `Prinzip ${nextPrincipleIndex + 1}`,
          });
          await expect(nextPrincipleLink).toBeVisible();
          await nextPrincipleLink.click();
          await expect(page).toHaveURL(
            `${ROUTE_PRINCIPLES.url}/${principles[nextPrincipleIndex]}`,
          );
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

      // Check for rendered paragraphs
      const paragraphs = page.locator(".rich-text > div");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(0);

      // Check for highlighted principles in paragraphs
      const highlights = page.locator("mark");
      const highlightCount = await highlights.count();
      expect(highlightCount).toBeGreaterThan(0);
    });

    test(`navigates to laws associated with principle: ${principle}`, async ({
      page,
    }) => {
      await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

      // Verify the link with dynamic content exists
      const lawLinks = page.locator(`a[href^="${ROUTE_LAWS.url}"]`);
      await expect(lawLinks.nth(0)).toBeVisible();
      await lawLinks.nth(0).click();

      await expect(page).toHaveURL(new RegExp(`${ROUTE_LAWS.url}/.+`));
    });
  }
});
