import { describe, expect, it } from "vitest";
import { getWizardSession } from "./session";

describe("getWizardSession", () => {
  it("resolves previous and next page from the current path", () => {
    const session = getWizardSession(
      "vorpruefung",
      "/vorpruefung/datenaustausch/",
    );

    expect(session.prevPath).toBe(
      "/vorpruefung/verpflichtungen-fuer-beteiligte",
    );
    expect(session.nextPath()).toBe("/vorpruefung/kommunikation");
  });

  it("has no previous page on the first step", () => {
    const session = getWizardSession("vorpruefung", "/vorpruefung/it-system");

    expect(session.prevPath).toBeUndefined();
  });

  it("evaluates guards with the given user data", () => {
    const answers = {
      "it-system": "yes",
      "verpflichtungen-fuer-beteiligte": "no",
      datenaustausch: "no",
      kommunikation: "unsure",
      automatisierung: "no",
      "eu-bezug": "yes",
    } as const;

    expect(
      getWizardSession("vorpruefung", "/vorpruefung/eu-bezug").nextPath(),
    ).toBeUndefined();
    expect(
      getWizardSession(
        "vorpruefung",
        "/vorpruefung/eu-bezug",
        answers,
      ).nextPath(),
    ).toBe("/vorpruefung/ergebnis");
  });
});
