import { expect, type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

const EMAIL_INPUT_ERROR = "email-error";
const TITLE_INPUT_ERROR = "title-error";

test.describe("test positive result for digital and negative for interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all digital questions with yes and all interoperability questions with no and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Nein" : "Ja")
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

  test("page headline shows positive result for digital and neagtive for interoperability", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
  });

  test("page does not contains link to interoperability landing page", async () => {
    await expect(page.getByRole("main")).not.toContainText(
      "Erfahren Sie mehr über Interoperabilität",
    );
    await expect(
      page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
    ).not.toBeVisible();
  });

  test("negative reasoning input is not visible", async () => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("email recipients do not include digitalcheck team if interoperability is negative", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    // set expected to undefined to set notExpected
    await registerMailInterceptionHandlerAndExpect(page, undefined, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });

  test("email body contains result title", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    await registerMailInterceptionHandlerAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });
});
