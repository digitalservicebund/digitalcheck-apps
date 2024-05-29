import { expect, test } from "@playwright/test";

test.describe("basic example test", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Digitalcheck");
  });

  test("shows hello message", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator(
        "h1:has-text('Digitaltaugliche Regelungsvorhaben erarbeiten')",
      ),
    ).toBeVisible();
  });
});
