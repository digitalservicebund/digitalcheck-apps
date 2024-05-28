import { expect, test } from "@playwright/test";

test.describe("basic example test", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Dito");
  });

  test("shows hello message", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("h1:has-text('Hello DigitalService!')"),
    ).toBeVisible();
  });
});
