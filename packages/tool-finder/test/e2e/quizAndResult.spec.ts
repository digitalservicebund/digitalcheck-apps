import { expect, test, type Page } from "@playwright/test";

import { getAllObjects } from "../../src/persistance/repository";
import * as allRoutes from "../../src/routes";

async function fillOutForm(page: Page) {
  await page.getByLabel("Ressort").selectOption("bmi");
  await page.getByLabel("Für meinen Austausch").check();
  await page.getByLabel("Interaktionen von Akteuren").check();
}

async function submitForm(page: Page) {
  await page.getByRole("button", { name: "Werkzeug suchen" }).click();
}

test.describe("test quiz page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(allRoutes.PATH_QUIZ);
  });

  test("page has h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Werkzeugfinder" }),
    ).toBeVisible();
  });

  test("selecting and submitting form redirects to result page", async ({
    page,
  }) => {
    await fillOutForm(page);
    await submitForm(page);
    await expect(page).toHaveURL(allRoutes.PATH_RESULT);
  });

  test("submitting without selection shows an error message", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Werkzeug suchen" }).click();
    await expect(
      page.getByRole("group", { name: "1 von 3" }).getByTestId("inputError"),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "2 von 3" }).getByTestId("inputError"),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "3 von 3" }).getByTestId("inputError"),
    ).toBeVisible();
  });
});

test.describe("test result page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(allRoutes.PATH_QUIZ);
    await fillOutForm(page);
    await submitForm(page);
  });

  test("visualisation object leads to correct cluster", async ({ page }) => {
    const allObjects = getAllObjects();

    for (const object of allObjects) {
      await page.goto(allRoutes.PATH_QUIZ);
      await fillOutForm(page);
      await page
        .getByRole("group", { name: "2 von 3" })
        .getByLabel(object.name)
        .check();
      await submitForm(page);
      await expect(
        page.getByRole("heading", { name: object.cluster }),
      ).toBeVisible();
      await expect(page.getByTestId("cluster-img")).toBeVisible();
    }
  });

  test("recommendation shows image and alternatives", async ({ page }) => {
    await expect(
      page.getByRole("img", { name: "Benutzeroberfläche" }),
    ).toBeVisible();
    await expect(
      page
        .getByText("VersionBundescloud")
        .getByRole("heading", { name: "Alternativen" }),
    ).toBeVisible();
  });

  test("change selection button works", async ({ page }) => {
    await page.getByRole("link", { name: "Eingaben ändern" }).click();
    await expect(page).toHaveURL(allRoutes.PATH_QUIZ);
    await expect(page.getByLabel("Ressort")).toHaveValue("bmi");
    await expect(page.getByLabel("Interaktionen von Akteuren")).toBeChecked();
    await expect(page.getByLabel("Für meinen Austausch")).toBeChecked();
  });

  test("going to info page resets state", async ({ page }) => {
    await page.goto(allRoutes.PATH_QUIZ);
    await expect(page.getByLabel("Ressort")).toHaveValue("bmi");
    await expect(page.getByLabel("Interaktionen von Akteuren")).toBeChecked();
    await expect(page.getByLabel("Für meinen Austausch")).toBeChecked();
    await page.goto(allRoutes.PATH_INFO);
    await expect(
      page.getByRole("link", { name: "Werkzeug finden" }),
    ).toBeVisible();
    await page.goto(allRoutes.PATH_QUIZ);
    await expect(page.getByLabel("Ressort")).toHaveValue("");
    await expect(
      page.getByLabel("Interaktionen von Akteuren"),
    ).not.toBeChecked();
    await expect(page.getByLabel("Für meinen Austausch")).not.toBeChecked();
  });

  test("feedback form is visible and clickable", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Ihr Feedback hilft uns weiter!" }),
    ).toBeVisible();
    await page
      .locator("fieldset")
      .filter({ hasText: "Ich habe gefunden" })
      .getByLabel("3")
      .check();
    await expect(
      page
        .locator("fieldset")
        .filter({ hasText: "Ich habe gefunden" })
        .getByLabel("3"),
    ).toBeChecked();
    await page
      .locator("fieldset")
      .filter({ hasText: "Die Anwendung" })
      .getByLabel("2")
      .check();
    await expect(
      page
        .locator("fieldset")
        .filter({ hasText: "Die Anwendung" })
        .getByLabel("2"),
    ).toBeChecked();
  });
});
