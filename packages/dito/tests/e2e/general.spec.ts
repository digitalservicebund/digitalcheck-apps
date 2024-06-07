import { expect, test } from "@playwright/test";
import allRoutes from "resources/allRoutes";
import { precheck } from "resources/content";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test general availability", () => {
  test("all routes are reachable and have a breadcrumb menu + title", async ({
    page,
  }) => {
    for await (const route of allRoutes) {
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

test.describe("test internal links", () => {
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
    await page.getByRole("navigation").getByRole("link").click();
    await expect(page).toHaveURL(staticRoutes.PATH_LANDING);
    await page.goto(precheck.questions[0].url);
    // using label here as there is a sidebar with the same role
    await page
      .getByLabel("navigation")
      .getByRole("link", { name: "Startseite" })
      .click();
    await expect(page).toHaveURL(staticRoutes.PATH_LANDING);
  });

  test("breadcrumb parent link works", async ({ page }) => {
    // using label here as there is a sidebar with the same role
    await page.goto(precheck.questions[0].url);
    await expect(page.getByLabel("navigation").getByRole("link")).toHaveCount(
      2,
    );
    await page.getByLabel("navigation").getByRole("link").last().click();
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });
});

test.describe("test general links", () => {
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

//   test("examplary breadcrumbs are correct", async ({ page }) => {
//     await page.goto(allRoutes.PATH_INFO);
//     await expect(page.getByTestId("breadcrumbs-menu")).toHaveText("Startseite");

//     await page.goto(allRoutes.PATH_QUIZ);
//     await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
//       "Startseite/Werkzeugfinder für Visualisierungen",
//     );

//     await page.getByLabel("Ressort").selectOption("bmi");
//     await page.getByLabel("Für meinen Austausch").check();
//     await page.getByLabel("Interaktionen von Akteuren").check();
//     await page.getByRole("button", { name: "Werkzeug suchen" }).click();
//     await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
//       "Startseite/Werkzeugfinder für Visualisierungen/Empfohlenes Werkzeug",
//     );

//     await page.goto(allRoutes.PATH_A11Y);
//     await expect(page.getByTestId("breadcrumbs-menu")).toHaveText(
//       "Startseite/Barrierefreiheit",
//     );
//   });

//   test("clicking on breadcrumbs navigates to correct page", async ({
//     page,
//   }) => {
//     await page.goto(allRoutes.PATH_QUIZ);
//     await page.getByText("Startseite").click();
//     await expect(page).toHaveURL(allRoutes.PATH_INFO);
//   });

//   test("links in imprint work", async ({ page }) => {
//     await page.goto(allRoutes.PATH_IMPRINT);
//     await page
//       .getByRole("main")
//       .getByRole("link", { name: "Datenschutzerklärung" })
//       .click();
//     await expect(page).toHaveURL(allRoutes.PATH_PRIVACY);
//     await page.goBack();
//     await page
//       .getByRole("main")
//       .getByRole("link", { name: "Barrierefreiheit" })
//       .click();
//     await expect(page).toHaveURL(allRoutes.PATH_A11Y);
//   });