import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { ROUTE_RESULT } from "resources/staticRoutes";

test.describe("test positive assessment page", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test("accepts user input on assessment page", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy #123",
    );
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("title can't be too long", async ({ page }) => {
    await page
      .getByLabel("Arbeitstitel des Vorhabens")
      .fill("Policy #987".repeat(500));
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByRole("main")).toContainText("kürzeren Titel");
  });
});

test.describe("test form in negative case", () => {
  test.beforeEach(
    "Fill preCheck questions with negative answers",
    async ({ page }) => {
      await page.goto(preCheck.questions[0].url);
      for (let i = 0; i < preCheck.questions.length; i++) {
        await page.waitForURL(preCheck.questions[i].url);
        await page.getByLabel("Nein").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("negative reasoning is required", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });

  test("title is required", async ({ page }) => {
    await page
      .getByLabel("Begründung")
      .fill("Dieses Vorhaben hat keinen Digitalbezug.");
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
  });

  test("title and reasoning can't be too long", async ({ page }) => {
    await page.getByLabel("Begründung").fill("A".repeat(5001));
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("B".repeat(501));
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByRole("main")).toContainText("kürzeren Titel");
    await expect(page.getByRole("main")).toContainText("kürzere Begründung");
  });
});

test.describe("test quicksend email", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test.skip("creates draft email with correct subject", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");

    const requestPromise = page.waitForRequest(/mailto:.*/);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    const request = await requestPromise;
    const mailTo = new URL(request.url());

    expect(mailTo.searchParams.get("subject")).toBe(
      "Digitalcheck Vorprüfung: „Policy ABCDEFG“",
    );
  });
});
