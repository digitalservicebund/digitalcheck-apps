import { expect, Page, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { ROUTE_RESULT } from "resources/staticRoutes";

async function interceptMailToRedirectAndExpect(
  page: Page,
  expected?: {
    subject?: string;
    recipients?: string[];
    cc?: string[];
    bodyContains?: string[];
  },
) {
  await page.route("**", async (route) => {
    const response = await route.fetch();
    const status = response.headers()["x-remix-status"];
    const redirectUrl = response.headers()["x-remix-redirect"];

    if (status === "302" && redirectUrl?.startsWith("mailto:")) {
      const mailTo = new URL(redirectUrl);
      if (expected?.subject)
        expect(mailTo.searchParams.get("subject")).toBe(expected?.subject);
      expected?.recipients?.forEach((expectedRecipient) =>
        expect(mailTo.pathname).toContain(expectedRecipient),
      );
      expected?.cc?.forEach((expectedCC) =>
        expect(mailTo.searchParams.get("cc")).toContain(expectedCC),
      );
      expected?.bodyContains?.forEach((expectedString) => {
        expect(mailTo.searchParams.get("body")).toContain(expectedString);
      });

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
    await page.getByLabel("Ihre E-Mail Adresse (optional)").fill("foo@bar.de");
    await expect(page.getByLabel("Ihre E-Mail Adresse (optional)")).toHaveValue(
      "foo@bar.de",
    );
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy 123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy 123",
    );
    await interceptMailToRedirectAndExpect(page);
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

  test("email input is optional", async ({ page }) => {
    // not filling email
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy 123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy 123",
    );
    await interceptMailToRedirectAndExpect(page, {
      subject: "Digitalcheck Vorprüfung: „Policy 123“",
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
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

test.describe("test email positive result with mixed answers", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[1].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 2; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test("creates email with correct subject", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");

    await interceptMailToRedirectAndExpect(page, {
      subject: "Digitalcheck Vorprüfung: „Policy ABCDEFG“",
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
  });

  test("creates email with correct recipients", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await page.getByLabel("Ihre E-Mail Adresse (optional)").fill("foo@bar.de");
    await interceptMailToRedirectAndExpect(page, {
      recipients: ["nkr@bmj.bund.de"],
      cc: ["foo@bar.de"],
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
  });

  test("email contains all answers", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    const bodyContains = [
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
      "In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
      preCheck.questions[0].negativeResult,
    ];
    for (let i = 1; i < preCheck.questions.length; i++) {
      bodyContains.push(preCheck.questions[i].positiveResult);
    }

    await interceptMailToRedirectAndExpect(page, {
      bodyContains: bodyContains,
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
  });
});

test.describe("test email negative result", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test("email contains negative reasoning", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await page
      .getByLabel("Begründung")
      .fill(
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      );
    await interceptMailToRedirectAndExpect(page, {
      bodyContains: [
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
        "Begründung:",
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      ],
    });
    await page.getByTestId("result-email-button").click();
    await expect(page.getByTestId("title-error")).not.toBeVisible();
  });
});
