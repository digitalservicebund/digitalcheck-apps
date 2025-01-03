import { expect, test } from "@playwright/test";
import {
  ROUTE_LAWS,
  ROUTE_PRINCIPLES,
  ROUTE_VISUALISATIONS,
} from "resources/staticRoutes";

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
      context,
    }) => {
      const url = `${ROUTE_PRINCIPLES.url}/${principle}`;
      await page.goto(url);

      const lawLinks = page.locator(`a[href^="${ROUTE_LAWS.url}"]`);
      await expect(lawLinks.first()).toBeVisible();

      const [newTab] = await Promise.all([
        context.waitForEvent("page"),
        lawLinks.first().click(),
      ]);

      await newTab.waitForLoadState("load");
      await expect(newTab).toHaveURL(new RegExp(`${ROUTE_LAWS.url}/.+`));

      const mainContent = newTab.getByRole("main");
      await expect(mainContent).toBeVisible();
    });
  }
});

test.describe("Visualizations Overview Page", () => {
  test("displays main heading and subtitle", async ({ page }) => {
    await page.goto(ROUTE_VISUALISATIONS.url);

    const pageTitle = page.getByRole("heading").first();
    await expect(pageTitle).toContainText("Beispiele für Visualisierungen");

    const subtitle = page.getByText(
      "Hier finden Sie Visualisierungen, welche Legistinnen und Legisten beim Erarbeiten der Digitaltauglichkeit geholfen haben und veröffentlicht wurden.",
    );
    await expect(subtitle).toBeVisible();
  });

  test("displays visualization details correctly", async ({ page }) => {
    await page.goto(ROUTE_VISUALISATIONS.url);

    const firstVisualization = page.locator(".flex.max-sm\\:flex-col").first();

    await expect(firstVisualization.locator("img")).toBeVisible();

    const metadataSection = firstVisualization.locator(".p-12.bg-gray-100");
    await expect(metadataSection.getByText("Veröffentlicht am")).toBeVisible();
    await expect(
      metadataSection.getByText("Art der Visualisierung"),
    ).toBeVisible();
  });

  test("opens images in new tab", async ({ page, context }) => {
    await page.goto(ROUTE_VISUALISATIONS.url);

    const firstImage = page.locator('a[target="_blank"]').first();
    await expect(firstImage).toBeVisible();

    // Test image zoom in new tab
    const [newTab] = await Promise.all([
      context.waitForEvent("page"),
      firstImage.click(),
    ]);

    await newTab.waitForLoadState("load");
    expect(newTab.url()).toMatch(/^https?:\/\/secure-dinosaurs.+/);
  });

  test("navigation to regulation detail works", async ({ page }) => {
    await page.goto(ROUTE_VISUALISATIONS.url);

    const firstRegulationLink = page
      .locator(`a[href^="${ROUTE_LAWS.url}"]`)
      .first();
    await firstRegulationLink.click();

    await expect(page).toHaveURL(new RegExp(`${ROUTE_LAWS.url}/.+`));
  });
});
