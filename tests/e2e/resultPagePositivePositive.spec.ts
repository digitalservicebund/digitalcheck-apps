import { expect, type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import {
  ROUTE_DOCUMENTATION,
  ROUTE_INTEROPERABILITY,
  ROUTE_METHODS,
  ROUTE_RESULT,
} from "~/resources/staticRoutes";

const { questions } = preCheck;

const EMAIL_INPUT_ERROR = "email-error";
const TITLE_INPUT_ERROR = "title-error";

test.describe("test positive result for digital and interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all pre-check questions with yes and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Ja").click();
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

  test("page headline shows positive result for digital and interoperability", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
  });

  test("page contains all answers in positive form", async () => {
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    );
    for (const question of questions) {
      await expect(page.getByRole("main")).toContainText(
        question.positiveResult,
      );
    }
  });

  test("page contains link to interoperability landing page", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Erfahren Sie mehr über Interoperabilität",
    );
    await expect(
      page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
    ).toBeVisible();
  });

  test("link to interoperability landing page leads to interoperability landing page", async () => {
    await page.getByRole("link", { name: "Mehr zu Interoperabilität" }).click();
    await page.waitForURL(ROUTE_INTEROPERABILITY.url);
  });

  test("email input is visible", async () => {
    await expect(page.getByLabel("Ihre E-Mail Adresse")).toBeVisible();
  });

  test("title input is visible", async () => {
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toBeVisible();
  });

  test("negative reasoning input is not visible", async () => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("error is shown if title is empty", async () => {
    // not filling title
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
  });

  test("error is shown if title is too long", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("A".repeat(101));
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
    await expect(page.locator("main")).toContainText("kürzeren Titel");
  });

  test("no error is shown if optional email is empty", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    // not filling email
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(EMAIL_INPUT_ERROR)).not.toBeVisible();
  });

  test("no error shown when email and title are filled", async () => {
    await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page);
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
    await expect(page.getByTestId(EMAIL_INPUT_ERROR)).not.toBeVisible();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).not.toBeVisible();
  });

  test("email subject includes title", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");

    await registerMailInterceptionHandlerAndExpect(page, {
      subject: "Digitalcheck Vorprüfung: „Policy ABC“",
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email recipients include nkr", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      recipients: ["nkr@bmj.bund.de"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email recipients include digitalcheck team if interoperability is positive", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email cc includes email from email input", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
    await registerMailInterceptionHandlerAndExpect(page, {
      cc: ["foo@bar.de"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains result title", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains all answers in positive form", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    const bodyContains = [
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    ];
    questions.forEach((question) => {
      bodyContains.push(question.positiveResult);
    });

    await registerMailInterceptionHandlerAndExpect(page, {
      body: bodyContains,
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body does not contain negative reasoning", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, undefined, {
      body: ["Begründung:"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("result page links to methods", async () => {
    await page.getByRole("link", { name: "Zu „Erarbeiten“" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS.url);
  });

  test("result page links to documentation", async () => {
    await page.getByRole("link", { name: "Zu „Dokumentieren“" }).click();
    await expect(page).toHaveURL(ROUTE_DOCUMENTATION.url);
  });
});
