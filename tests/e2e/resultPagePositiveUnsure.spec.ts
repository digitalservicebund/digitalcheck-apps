import { expect, type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

test.describe("test positive result for digital and unsure for interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all digital questions with yes and all interoperability questions with unsure and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ich bin unsicher" : "Ja")
          .click();
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

  test("page headline shows positive result for digital and unsure for interoperability", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
    );
  });

  test("page contains all answers for interoperability in unsure form", async () => {
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    );
    for (const question of questions.filter(
      (question) => question.interoperability,
    )) {
      await expect(page.getByRole("main")).toContainText(
        question.positiveResult,
      );
    }
  });

  test("page contains hint regarding unsure interopoerability", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Das können Sie tun: Kontaktieren Sie uns unter",
    );
  });

  test("page contains link to interoperability landing page", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Erfahren Sie mehr über Interoperabilität",
    );
    await expect(
      page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
    ).toBeVisible();
  });

  test("negative reasoning input is not visible", async () => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("email recipients include digitalcheck team if interoperability is unsure", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains result title", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains all answers for interoperability in unsure form", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    const bodyContains = [
      "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    ];
    questions
      .filter((question) => question.interoperability)
      .forEach((question) => {
        bodyContains.push(question.positiveResult);
      });

    await registerMailInterceptionHandlerAndExpect(page, {
      body: bodyContains,
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });
});
