import { expect, test } from "@playwright/test";
import { preCheck } from "~/resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "~/resources/staticRoutes";

test.describe("test redirect to pre-check in case of missing answers", () => {
  test("result page redirects to pre-check landing page if no question was answered", async ({
    page,
  }) => {
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });

  test("result page redirects to first unanswered question if not all questions have been answered", async ({
    page,
  }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });
});
