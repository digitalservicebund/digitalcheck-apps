import { expect, type Page } from "@playwright/test";

export async function registerMailInterceptionHandlerAndExpect(
  page: Page,
  expected?: {
    subject?: string;
    recipients?: string[];
    cc?: string[];
    body?: string[];
  },
  notExpected?: {
    recipients?: string[];
    body?: string[];
  },
) {
  await page.route("**", async (route) => {
    const response = await route.fetch();
    const status = response.headers()["x-remix-status"];
    const redirectUrl = response.headers()["x-remix-redirect"];

    if (status !== "302" || !redirectUrl?.startsWith("mailto:")) {
      await route.continue();
      return;
    }

    const mailTo = new URL(redirectUrl);
    if (expected?.subject)
      expect(mailTo.searchParams.get("subject")).toBe(expected?.subject);
    expected?.recipients?.forEach((expectedRecipient) =>
      expect(decodeURIComponent(mailTo.pathname)).toContain(expectedRecipient),
    );
    expected?.cc?.forEach((expectedCC) =>
      expect(mailTo.searchParams.get("cc")).toContain(expectedCC),
    );
    expected?.body?.forEach((expectedString) => {
      expect(mailTo.searchParams.get("body")).toContain(expectedString);
    });

    notExpected?.recipients?.forEach((notExpectedRecipient) =>
      expect(decodeURIComponent(mailTo.pathname)).not.toContain(
        notExpectedRecipient,
      ),
    );
    notExpected?.body?.forEach((notExpectedString) => {
      expect(mailTo.searchParams.get("body")).not.toContain(notExpectedString);
    });

    await route.abort();
  });
}
