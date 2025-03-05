import { type Page, test } from "@playwright/test";
import { registerMailInterceptionHandlerAndExpect } from "tests/e2e/utils/registerMailInterceptionHandler";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

test.describe("test positive result with mixed answers", () => {
  let page: Page;
  test.beforeAll("Go to assessment page", async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(questions[0].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (const question of questions.slice(2)) {
      await page.waitForURL(question.url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test.beforeEach("go to result page", async () => {
    await page.goto(ROUTE_RESULT.url);
  });

  test.afterAll("close page", async () => {
    await page.close();
  });

  test("answers in email body are prefixed by a special character indicating the type of answer", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
    const bodyContains = [
      `- ${questions[0].negativeResult}`,
      `? ${questions[1].positiveResult}`,
      `+ ${questions[2].positiveResult}`,
    ];
    await registerMailInterceptionHandlerAndExpect(page, {
      body: bodyContains,
    });
    await page.getByRole("button", { name: "E-Mail erstellen" }).click();
  });
});
