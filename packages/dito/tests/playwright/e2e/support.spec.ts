import { expect, test } from "@playwright/test";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test support page", () => {
  test.beforeEach("Go to support page", async ({ page }) => {
    await page.goto(staticRoutes.ROUTE_SUPPORT.url);
  });

  // TODO: this test fails in CI, but works locally
  test("clicking on appointment button shows google and hides button", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Termin" }).click();
    await expect(page.getByRole("button", { name: "Termin" })).toBeHidden();
    await expect(
      page
        .frameLocator(
          'iframe[title="Beratung erhalten Sie in einem 45-minütigem Gespräch"]',
        )
        .getByRole("heading", { name: "Digitalcheck Suport" }),
    ).toBeVisible();
  });

  test("suppport tabs switch between offerings", async ({ page }) => {
    await page.getByRole("tab", { name: "Schnelle Hilfe" }).click();
    await expect(
      page.getByRole("heading", { name: "IT-Wissen" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Digitale Umsetzung erarbeiten" }),
    ).not.toBeVisible();

    await page.getByRole("tab", { name: "Umfangreiche Beratung" }).click();
    await expect(
      page.getByRole("heading", { name: "IT-Wissen" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Digitale Umsetzung erarbeiten" }),
    ).toBeVisible();
  });

  test("clicking on training link on landing page leads to correct tab", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Schulungen" }).click();
    await expect(
      page.getByRole("heading", { name: "Unsere Unterstützungsangebote" }),
    ).toBeInViewport();
    await expect(
      page.getByRole("heading", {
        name: "praktische Tipps für den Digitalcheck",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "IT-Wissen einfach erklärt" }),
    ).not.toBeVisible();
  });
});
