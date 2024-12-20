import { expect, test } from "@playwright/test";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test support page", () => {
  test.beforeEach("Go to support page", async ({ page }) => {
    await page.goto(staticRoutes.ROUTE_SUPPORT.url);
  });

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
        .getByText("Appointments"),
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
});
