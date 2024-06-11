import { expect, test } from "@playwright/test";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test result page", () => {
  test("happy path leads to positive result", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    // click through all 5 question pages
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(staticRoutes.PATH_RESULT);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    );
  });

  test("only positive answers are shown as reasons", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    );
    await expect(page.getByRole("main")).not.toContainText("IT-System");
  });

  test("result page with no answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(staticRoutes.PATH_RESULT);
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });

  test("result page without all answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(staticRoutes.PATH_RESULT);
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });
});
