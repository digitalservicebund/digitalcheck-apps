import { expect, test } from "@playwright/test";
import { ROUTE_LAWS, ROUTE_PRINCIPLES } from "resources/staticRoutes";

const principles = [
  "digitale-kommunikation-sicherstellen",
  "wiederverwendung-von-daten-und-standards-ermoeglichen",
  "datenschutz-und-informationssicherheit-gewaehrleisten",
  "klare-regelungen-fuer-eine-digitale-ausfuehrung-finden",
  "automatisierung-ermoeglichen",
];
test.setTimeout(30000);

test.describe("Digitaltauglichkeit main functionality", () => {
  test.describe("Principle-specific tests", () => {
    for (const principle of principles) {
      test(`displays detailed information for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

        await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

        const mainContent = page.getByRole("main");
        await mainContent.waitFor({ state: "visible" });

        await expect(mainContent).toContainText(
          `Prinzip ${principles.indexOf(principle) + 1} in Regelungstexten`,
        );
      });

      test(`renders navigation links for principle: ${principle}`, async ({
        page,
      }) => {
        await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

        await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

        const nextPrincipleIndex = principles.indexOf(principle) + 1;
        if (nextPrincipleIndex < principles.length) {
          const nextPrincipleLink = page.getByRole("link", {
            name: `Prinzip ${nextPrincipleIndex + 1}`,
          });

          await nextPrincipleLink.waitFor({ state: "visible" });

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

      await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

      const highlights = page.locator("mark");
      await highlights.first().waitFor({ state: "visible" });

      const highlightCount = await highlights.count();
      expect(highlightCount).toBeGreaterThan(0);
    });

    test(`navigates to laws associated with principle: ${principle}`, async ({
      page,
    }) => {
      await page.goto(`${ROUTE_PRINCIPLES.url}/${principle}`);

      await page.waitForURL(`${ROUTE_PRINCIPLES.url}/${principle}`);

      const lawLinks = page.locator(`a[href^="${ROUTE_LAWS.url}"]`);
      await lawLinks.first().waitFor({ state: "visible" });

      await Promise.all([
        page.waitForURL(new RegExp(`${ROUTE_LAWS.url}/.+`)),
        lawLinks.first().click(),
      ]);
    });
  }
});
