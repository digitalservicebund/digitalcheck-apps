import { describe, expect, it } from "vitest";
import { principleSchema } from "./documentationDataSchema";

const VALID_ID = "abc123documentId";

describe("principleSchema", () => {
  describe("positive answer (Ja)", () => {
    it("is valid with reasoning and aspects", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Ja, gänzlich oder teilweise",
        reasoning: "Some reasoning",
        aspects: ["aspect1"],
      });
      expect(result.success).toBe(true);
    });

    it("is invalid without aspects", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Ja, gänzlich oder teilweise",
        reasoning: "Some reasoning",
      });
      expect(result.success).toBe(false);
    });

    it("is invalid with empty aspects array", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Ja, gänzlich oder teilweise",
        reasoning: "Some reasoning",
        aspects: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("negative answer (Nein)", () => {
    it("is valid with reasoning and aspects absent (localStorage round-trip)", () => {
      // After JSON.stringify/parse, aspects: undefined is dropped entirely.
      // This simulates the Astro page-reload scenario.
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nein",
        reasoning: "Some reasoning",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with reasoning and aspects explicitly undefined (in-memory)", () => {
      // In the React Router version, aspects stays as an in-memory key with value undefined.
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nein",
        reasoning: "Some reasoning",
        aspects: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("is invalid without reasoning", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nein",
        reasoning: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("irrelevant answer (Nicht relevant)", () => {
    it("is valid with reasoning and aspects absent (localStorage round-trip)", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nicht relevant",
        reasoning: "Some reasoning",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with reasoning and aspects explicitly undefined (in-memory)", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nicht relevant",
        reasoning: "Some reasoning",
        aspects: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("is invalid without reasoning", () => {
      const result = principleSchema.safeParse({
        id: VALID_ID,
        answer: "Nicht relevant",
        reasoning: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
