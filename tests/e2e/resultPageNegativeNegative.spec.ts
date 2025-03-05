import { expect, type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

const NEGATIVE_REASONING_ERROR = "negativeReasoning-error";

test.describe("test negative result for digital and interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all pre-check questions with no and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Nein").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test.beforeEach("go to result page", async () => {
    await page.goto(ROUTE_RESULT.url);
  });

  test.afterAll("close page", async () => {
    await page.close();
  });

  test("page headline shows negative result for digital and interoperability", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
  });

  test("page contains all answers in negative form", async () => {
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    );
    for (const question of questions) {
      await expect(page.getByRole("main")).toContainText(
        question.negativeResult,
      );
    }
  });

  test("page does not contains link to interoperability landing page", async () => {
    await expect(page.getByRole("main")).not.toContainText(
      "Erfahren Sie mehr über Interoperabilität",
    );
    await expect(
      page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
    ).not.toBeVisible();
  });

  test("email input is visible", async () => {
    await expect(page.getByLabel("Ihre E-Mail Adresse")).toBeVisible();
  });

  test("title input is visible", async () => {
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toBeVisible();
  });

  test("negative reasoning input is visible", async () => {
    await expect(page.getByLabel("Begründung")).toBeVisible();
  });

  test("error is shown if negative reasoning is empty", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });

  test("error is shown if negative reasoning is too long", async () => {
    await page.getByLabel("Begründung").fill("A".repeat(501));
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toBeVisible();
    await expect(page.locator("main")).toContainText("kürzere Begründung");
  });

  test("email body contains all answers in negative form", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    const bodyContains = [
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    ];
    for (const question of questions) {
      bodyContains.push(question.negativeResult);
    }

    await registerMailInterceptionHandlerAndExpect(page, {
      body: bodyContains,
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains result title", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains negative reasoning", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await page
      .getByLabel("Begründung")
      .fill(
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      );
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Begründung:",
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });
});
