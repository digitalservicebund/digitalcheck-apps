import { describe, expect, it } from "vitest";
import {
  dokumentationFields,
  prinzipSchema,
  toPrinzipOrder,
} from "./dokumentationSchema";

const issuesOf = (data: Record<string, unknown>) =>
  Object.fromEntries(
    (prinzipSchema(1).safeParse(data).error?.issues ?? []).map((issue) => [
      issue.path[0],
      issue.message,
    ]),
  );

describe("prinzipSchema", () => {
  it("has the fields of each Prinzip", () => {
    expect(Object.keys(prinzipSchema(3).shape)).toEqual([
      "prinzip3-antwort",
      "prinzip3-schwerpunkte",
      "prinzip3-erklaerung",
    ]);
    for (const name of Object.keys(prinzipSchema(3).shape)) {
      expect(dokumentationFields).toHaveProperty(name);
    }
  });

  describe("with stored answers", () => {
    it("requires Schwerpunkte and Erklärung for 'yes'", () => {
      expect(issuesOf({ "prinzip1-antwort": "yes" })).toEqual({
        "prinzip1-schwerpunkte":
          "Bitte wählen Sie mindestens einen Schwerpunkt aus.",
        "prinzip1-erklaerung": "Bitte geben Sie eine Erklärung an.",
      });
    });

    it("requires only the Erklärung for 'no' and 'not-relevant'", () => {
      for (const answer of ["no", "not-relevant"]) {
        expect(issuesOf({ "prinzip1-antwort": answer })).toEqual({
          "prinzip1-erklaerung": "Bitte geben Sie eine Erklärung an.",
        });
      }
    });

    it("accepts complete answers and keeps Schwerpunkte of an earlier 'yes'", () => {
      expect(
        issuesOf({
          "prinzip1-antwort": "no",
          "prinzip1-schwerpunkte": ["barrierefreiheit"],
          "prinzip1-erklaerung": "Text",
        }),
      ).toEqual({});
    });
  });

  describe("with values of the form", () => {
    it("reports shown but empty fields by their own schema", () => {
      // Shown fields are read as "" or [], hidden ones are missing
      expect(
        issuesOf({
          "prinzip1-antwort": "yes",
          "prinzip1-schwerpunkte": [],
          "prinzip1-erklaerung": "",
        }),
      ).toEqual({
        "prinzip1-schwerpunkte":
          "Bitte wählen Sie mindestens einen Schwerpunkt aus.",
        "prinzip1-erklaerung": "Bitte geben Sie eine Erklärung an.",
      });
    });

    it("only reports the missing answer while nothing else is shown", () => {
      expect(issuesOf({})).toEqual({
        "prinzip1-antwort": "Bitte wählen Sie eine Option aus.",
      });
    });
  });
});

describe("toPrinzipOrder", () => {
  it("throws for a Prinzip without fields", () => {
    expect(toPrinzipOrder(5)).toBe(5);
    expect(() => toPrinzipOrder(6)).toThrow(
      "The Dokumentation has no fields for Prinzip 6.",
    );
  });
});
