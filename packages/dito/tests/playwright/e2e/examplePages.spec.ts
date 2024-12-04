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
  for (const principle of principles) {
    test(`displays detailed information for principle: ${principle}`, async ({
      page,
    }) => {
      const url = `${ROUTE_PRINCIPLES.url}/${principle}`;
      await page.goto(url);

      const mainContent = page.getByRole("main");
      await expect(mainContent).toContainText(
        `Prinzip ${principles.indexOf(principle) + 1} in Regelungstexten`,
      );
    });

    test(`renders navigation links for principle: ${principle}`, async ({
      page,
    }) => {
      const url = `${ROUTE_PRINCIPLES.url}/${principle}`;
      await page.goto(url);

      const nextPrincipleIndex = principles.indexOf(principle) + 1;
      if (nextPrincipleIndex < principles.length) {
        const nextPrincipleLink = page.getByRole("link", {
          name: `Prinzip ${nextPrincipleIndex + 1}`,
        });

        await nextPrincipleLink.click();
        await expect(page).toHaveURL(
          `${ROUTE_PRINCIPLES.url}/${principles[nextPrincipleIndex]}`,
        );
      }
    });
  }
});

test.describe("Digitaltauglichkeit Prinzipien Detail", () => {
  for (const principle of principles) {
    test(`displays paragraphs with relevant principles for: ${principle}`, async ({
      page,
    }) => {
      const url = `${ROUTE_PRINCIPLES.url}/${principle}`;
      await page.goto(url);

      const highlights = page.locator("mark");
      await expect(highlights.first()).toBeVisible();

      const highlightCount = await highlights.count();
      expect(highlightCount).toBeGreaterThan(0);
    });

    test(`navigates to laws associated with principle: ${principle}`, async ({
      page,
    }) => {
      const url = `${ROUTE_PRINCIPLES.url}/${principle}`;
      await page.goto(url);

      const lawLinks = page.locator(`a[href^="${ROUTE_LAWS.url}"]`);
      await expect(lawLinks.first()).toBeVisible();

      await Promise.all([page.waitForNavigation(), lawLinks.first().click()]);

      expect(page.url()).toMatch(new RegExp(`${ROUTE_LAWS.url}/.+`));
    });
  }
});
