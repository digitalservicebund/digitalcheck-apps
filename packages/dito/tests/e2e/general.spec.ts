import { expect, test } from "@playwright/test";
import allRoutes from "resources/allRoutes";
import { preCheck } from "resources/content";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test general availability", () => {
  test("all routes are reachable and have a breadcrumb menu + title if they aren't PDF", async ({
    page,
  }) => {
    for await (const route of allRoutes) {
      if (route.url.endsWith(".pdf")) {
        continue;
      }
      await page.goto(route.url);
      await expect(page.getByTestId("breadcrumbs-menu")).toBeVisible();
      await expect(page).toHaveTitle(/Digitalcheck$/);
    }
  });
});

test.describe("test landing page", () => {
  test("landing is reachable and has h1", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator(
        "h1:has-text('Digitaltaugliche Regelungsvorhaben erarbeiten')",
      ),
    ).toBeVisible();
  });

  test("CTA on landing works", async ({ page }) => {
    await page.goto(staticRoutes.PATH_LANDING);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });

  test("list items on landing page are visible", async ({ page }) => {
    await page.goto(staticRoutes.PATH_LANDING);
    await expect(page.getByRole("main")).toContainText(
      "1Vorprüfung: Digitalbezug einschätzen",
    );
    await expect(page.getByRole("main")).toContainText(
      "2Digitaltaugliches Regelungsvorhaben erarbeiten",
    );
    await expect(page.getByRole("main")).toContainText(
      "3Abschließende Dokumentation",
    );
    await expect(page.getByRole("main")).toContainText(
      "4Digitalcheck durch den NKR",
    );
  });
});

test.describe("test links", () => {
  test("links in footer work", async ({ page }) => {
    // TODO: reenable once the pages are implemented (remove 404 and extra gotos)
    await page.goto(staticRoutes.PATH_LANDING);
    await page.getByRole("link", { name: "Datenschutzerklärung" }).click();
    await expect(page.getByRole("main")).toContainText("404");
    // await expect(page).toHaveURL(staticRoutes.PATH_PRIVACY);
    await page.goto(staticRoutes.PATH_LANDING);
    await page.getByRole("link", { name: "Barrierefreiheit" }).click();
    await expect(page.getByRole("main")).toContainText("404");
    // await expect(page).toHaveURL(staticRoutes.PATH_A11Y);
    await page.goto(staticRoutes.PATH_LANDING);
    await page.getByRole("link", { name: "Impressum" }).click();
    await expect(page.getByRole("main")).toContainText("404");
    // await expect(page).toHaveURL(staticRoutes.PATH_IMPRINT);
  });

  test("breadcrumb landing link works", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page
      .getByLabel("navigation")
      .getByRole("link", { name: "Startseite" })
      .click();
    await expect(page).toHaveURL(staticRoutes.PATH_LANDING);
    await page.goto(preCheck.questions[0].url);
    // using label here as there is a sidebar with the same role
    await page
      .getByLabel("navigation")
      .getByRole("link", { name: "Startseite" })
      .click();
    await expect(page).toHaveURL(staticRoutes.PATH_LANDING);
  });

  test("breadcrumb parent link works", async ({ page }) => {
    // using label here as there is a sidebar with the same role
    await page.goto(preCheck.questions[0].url);
    await expect(page.getByLabel("navigation").getByRole("link")).toHaveCount(
      2,
    );
    await page.getByLabel("navigation").getByRole("link").last().click();
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });

  test("links in landing page work", async ({ page }) => {
    await page.goto(staticRoutes.PATH_LANDING);
    await page.getByRole("link", { name: "Hilfestellungen" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_METHODS);
  });

  test("links leading to external pages open in new tab", async ({ page }) => {
    await page.goto(staticRoutes.PATH_LANDING);
    const link = page.getByRole("link", {
      name: "DigitalService GmbH des Bundes",
    });

    await link.click();
    // wait for a second to let the new tab open
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(staticRoutes.PATH_LANDING);
  });
});
