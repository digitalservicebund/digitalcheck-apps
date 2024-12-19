import { expect, Page, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { ROUTE_RESULT } from "resources/staticRoutes";

async function interceptMailToRedirectAndExpect(
  page: Page,
  expected?: {
    subject?: string;
    recipient?: string;
    bodyContains?: string;
  },
) {
  await page.route("**", async (route) => {
    const response = await route.fetch();
    const status = response.headers()["x-remix-status"];
    const redirectUrl = response.headers()["x-remix-redirect"];

    if (status === "302" && redirectUrl?.startsWith("mailto:")) {
      const mailTo = new URL(redirectUrl);
      expect(mailTo.pathname).toContain(expected?.recipient || "");
      expect(mailTo.searchParams.get("subject")).toBe(expected?.subject || "");
      expect(mailTo.searchParams.get("body")).toContain(
        expected?.bodyContains || "",
      );
      await route.abort();
    } else {
      await route.continue();
    }
  });
}

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
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy 123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy 123",
    );
    await interceptMailToRedirectAndExpect(page, {
      subject: `Digitalcheck Vorprüfung: „Policy 123“`,
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
  });

  test("title can't be too long", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("A".repeat(501));
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).toBeVisible();
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
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("negativeReasoning-error")).toBeVisible();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });

  test("title is required", async ({ page }) => {
    await page
      .getByLabel("Begründung")
      .fill("Dieses Vorhaben hat keinen Digitalbezug.");
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).toBeVisible();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
  });

  test("title and reasoning can't be too long", async ({ page }) => {
    await page.getByLabel("Begründung").fill("A".repeat(5001));
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("B".repeat(501));
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).toBeVisible();
    await expect(page.getByTestId("negativeReasoning-error")).toBeVisible();
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

  test("creates draft email with correct subject", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");

    await interceptMailToRedirectAndExpect(page, {
      subject: "Digitalcheck Vorprüfung: „Policy ABCDEFG“",
      bodyContains: "ausgefüllten Vorprüfung im Rahmen des Digitalcheck",
      recipient: "nkr@bmj.bund.de",
    });
    await page.getByTestId("result-email-button").click();
  });
});
