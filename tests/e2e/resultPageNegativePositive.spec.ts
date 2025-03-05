import { expect, type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

test.describe("test negative result for digital and positive for interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all digital questions with no and all interoperability questions with yes and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ja" : "Nein")
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

  test("page headline shows negative result for digital and negative for interoperability", async () => {
    // no interoperability without digital
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
  });

  test("page shows warning that interoperability is not possible without digital", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
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
    await expect(page.getByLabel("Begründung")).toBeVisible();
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

  test("email body contains hint that interoperability is not possible if digital is negative", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });
});
