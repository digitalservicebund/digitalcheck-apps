import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { PATH_PRECHECK, PATH_RESULT } from "resources/staticRoutes";

test.describe("test result page general content", () => {
  test.beforeEach("Click though preCheck", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < 5; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(PATH_RESULT);
  });

  test("happy path leads to positive result", async ({ page }) => {
    await expect(page).toHaveURL(PATH_RESULT);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat Digitalbezug.",
    );
  });

  test("result page links to documentation", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Dokumentation" }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      "digitalcheck-begleitende-dokumentation.pdf",
    );
  });
});

test.describe("test result page reasoning", () => {
  test.beforeEach("Start preCheck", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
  });

  test("one positive answer leads to positive result", async ({ page }) => {
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat Digitalbezug.",
    );
  });

  test("only positive answers are shown as reasons in positive case", async ({
    page,
  }) => {
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(`mit "Ja" beantwortet`);
    await expect(page.getByRole("main")).not.toContainText("IT-Systems");
  });

  test("checking all negative answers leads to negative result", async ({
    page,
  }) => {
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(PATH_RESULT);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat keinen Digitalbezug.",
    );
    await expect(page.getByRole("main")).toContainText(
      `mit "Nein" beantwortet`,
    );
  });

  test("checking mix of unsure and negative answers leads to unsure result", async ({
    page,
  }) => {
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(PATH_RESULT);
    await expect(page.getByRole("main")).toContainText("Digitalcheck-Support");
    await expect(page.getByRole("main")).toContainText(
      "Es ist nicht klar, ob Ihr Regelungsvorhaben Digitalbezug hat.",
    );
    await expect(page.getByRole("main")).toContainText(
      `mit "Unsicher" beantwortet`,
    );
    await expect(page.getByRole("main")).toContainText(
      `mit "Nein" beantwortet`,
    );
    await expect(page.getByRole("main")).not.toContainText("nächsten Schritte");
  });
});

test.describe("test result page redirects", () => {
  test("result page with no answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(PATH_RESULT);
    await expect(page).toHaveURL(PATH_PRECHECK);
  });

  test("result page without all answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(PATH_RESULT);
    await expect(page).toHaveURL(PATH_PRECHECK);
  });
});
