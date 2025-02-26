import { expect, test } from "@playwright/test";
import * as allRoutes from "routes";

test.describe("test general functionality", () => {
  test("landing page to not have breadcrumbs", async ({ page }) => {
    await page.goto(allRoutes.PATH_INFO);
    await expect(page.getByTestId("breadcrumbs-menu")).not.toBeVisible();
  });

  test("all routes are reachable and have a breadcrumb menu + title", async ({
    page,
  }) => {
    for (const route of Object.values(allRoutes)) {
      if (route !== "/") {
        await page.goto(route);
        await expect(page.getByTestId("breadcrumbs-menu")).toBeVisible();
        await expect(page).toHaveTitle(/- Digitalcheck Werkzeugfinder$/);
      }
    }
  });

  test("recommendation page without selection redirects to quiz page", async ({
    page,
  }) => {
    await page.goto(allRoutes.PATH_RESULT);
    await expect(page).toHaveURL(allRoutes.PATH_QUIZ);
  });
});

test.describe("test links", () => {
  test("link in header works", async ({ page }) => {
    await page.goto(allRoutes.PATH_QUIZ);
    await page.getByLabel("Werkzeugfinder - Zurück zur").click();
    await expect(page).toHaveURL(allRoutes.PATH_INFO);
  });

  test("exemplary breadcrumbs are correct", async ({ page }) => {
    await page.goto(allRoutes.PATH_INFO);
    await expect(page.getByTestId("breadcrumbs-menu")).not.toBeVisible();

    await page.goto(allRoutes.PATH_QUIZ);
    await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
      "Startseite/Werkzeugfinder für Visualisierungen",
    );

    await page.getByTestId("ressort").selectOption("bmi");
    await page.getByLabel("Für meinen Austausch").check();
    await page.getByLabel("Interaktionen von Akteuren").check();
    await page.getByRole("button", { name: "Werkzeug suchen" }).click();
    await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
      "Startseite/Werkzeugfinder für Visualisierungen/Empfohlenes Werkzeug",
    );

    await page.goto(allRoutes.PATH_A11Y);
    await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
      "Startseite/Barrierefreiheit",
    );
  });

  test("clicking on breadcrumbs navigates to correct page", async ({
    page,
  }) => {
    await page.goto(allRoutes.PATH_QUIZ);
    await page.getByText("Startseite").click();
    await expect(page).toHaveURL(allRoutes.PATH_INFO);
  });

  [
    { name: "Datenschutzerklärung", url: allRoutes.PATH_PRIVACY },
    { name: "Barrierefreiheit", url: allRoutes.PATH_A11Y },
    { name: "Impressum", url: allRoutes.PATH_IMPRINT },
  ].forEach(({ name, url }) => {
    test(`link ${url} in footer works`, async ({ page }) => {
      await page.goto(allRoutes.PATH_INFO);
      await page.getByRole("link", { name: name }).click();
      await expect(page).toHaveURL(url);
    });
  });

  test("links in imprint work", async ({ page }) => {
    await page.goto(allRoutes.PATH_IMPRINT);
    await page
      .getByRole("main")
      .getByRole("link", { name: "Datenschutzerklärung" })
      .click();
    await expect(page).toHaveURL(allRoutes.PATH_PRIVACY);
    await page.goBack();
    await page
      .getByRole("main")
      .getByRole("link", { name: "Barrierefreiheit" })
      .click();
    await expect(page).toHaveURL(allRoutes.PATH_A11Y);
  });

  test("email links in feedback banner have correct attribute", async ({
    page,
  }) => {
    await page.goto(allRoutes.PATH_INFO);
    await expect(
      page
        .locator("p")
        .filter({ hasText: "Dieser Dienst ist im Aufbau." })
        .getByRole("link"),
    ).toHaveAttribute(
      "href",
      /^mailto:digitalcheck@digitalservice.bund.de\?subject=/,
    );
    await expect(
      page.locator("p").filter({ hasText: "Um diese Seite" }).getByRole("link"),
    ).toHaveAttribute(
      "href",
      /^mailto:digitalcheck@digitalservice.bund.de\?subject=.*&body=/,
    );
  });

  test("links leading to external pages open in new tab", async ({ page }) => {
    await page.goto(allRoutes.PATH_IMPRINT);
    const link = page.getByRole("link", {
      name: "DigitalService GmbH des Bundes",
    });

    await link.click();
    await expect(page).toHaveURL(allRoutes.PATH_IMPRINT, { timeout: 5000 });
  });
});

test.describe("test info page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(allRoutes.PATH_INFO);
  });

  test("page has h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Visualisieren im Digitalcheck" }),
    ).toBeVisible();
  });

  test("call to action", async ({ page }) => {
    await page.getByRole("link", { name: "Werkzeug finden" }).click();
    await expect(page).toHaveURL(allRoutes.PATH_QUIZ);
  });
});
