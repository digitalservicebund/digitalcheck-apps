import { methoden, prinzipien } from "@/config/routes";
import {
  ZFL_BASE_URL,
  ZFL_PATH_TECHNISCHE_UMSETZBARKEIT,
} from "@/resources/constants";
import { expect, test } from "@playwright/test";

const ROUTE_LANDING = "/";
const ROUTE_METHODS = methoden.path;
const ROUTE_METHODS_PRINCIPLES = prinzipien.path;
const ROUTE_METHODS_TECHNICAL_FEASIBILITY =
  ZFL_BASE_URL + ZFL_PATH_TECHNISCHE_UMSETZBARKEIT;

test.describe("five principles page", () => {
  test.fixme("five principles conditional next step is accurate", async ({
    page,
  }) => {
    await page.goto(ROUTE_LANDING);

    await page.getByRole("link", { name: "Details und Beispiele" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS_PRINCIPLES);

    await expect(page.getByRole("main")).toContainText(
      "Vorprüfung: Digitalbezug einschätzen",
    );
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await expect(page).toHaveURL(ROUTE_LANDING);

    await page.getByRole("link", { name: "Zu „Erarbeiten“" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS);

    await page.getByRole("link", { name: "Fünf Prinzipien nutzen" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS_PRINCIPLES);

    await expect(page.getByRole("main")).toContainText(
      "Technische Umsetzbarkeit sicherstellen",
    );
    await page.getByRole("link", { name: "IT-Auswirkungen prüfen" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS_TECHNICAL_FEASIBILITY);
  });
});

// TODO: Refactor code to test the right link to zfl beispiele
//   [
//     ROUTE_EXAMPLES_DIGITAL_COMMUNICATION,
//     ROUTE_EXAMPLES_REUSE_DATA_AND_STANDARDS,
//     ROUTE_EXAMPLES_DATA_PROTECTION_AND_INFORMATION_SECURITY,
//     ROUTE_EXAMPLES_AUTOMATION,
//   ].forEach((url, index) => {
//     test.fixme(`five principles page ${url} links to examples`, async ({
//       page,
//     }) => {
//       let attempt = 0;

//       // retries to prevent flakiness for firefox
//       while (attempt < 3) {
//         try {
//           await page.goto(ROUTE_METHODS_PRINCIPLES, {
//             waitUntil: "domcontentloaded",
//           });

//           const linksOnPage = await page
//             .locator('a:has-text("Beispiele betrachten")')
//             .all();
//           const link = linksOnPage[index];
//           await expect(link).toBeVisible({ timeout: 5000 });

//           const navigationPromise = page.waitForURL(url);
//           await link.click();
//           await navigationPromise;

//           await expect(page).toHaveURL(url);

//           break;
//         } catch (error) {
//           attempt++;
//           console.warn(`Retry ${attempt}: Error navigating to ${url}`);
//           if (attempt === 3) {
//             throw error;
//           }
//         }
//       }
//     });
//   });
// });
