import "./mockDocx.ts"; // set up mocks first

import type { Prinzip } from "@/content.config";
import { documentationDocument } from "@/resources/content/documentation-document";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import type { DocumentationData } from "@/routes/dokumentation/documentationDataSchema";
import { PatchType } from "docx";
import { describe, expect, it, vi } from "vitest";
import { getTextFromTextRun } from "./testUtils.ts";
import { buildPrinciplePatches } from "./wordDocumentation.ts";

const { placeholderOptional } = documentationDocument;
const { principlePages } = digitalDocumentation;
const [POSITIVE_ANSWER, NEGATIVE_ANSWER, IRRELEVANT_ANSWER] =
  principlePages.radioOptions;

const prinzips: Prinzip[] = [
  {
    documentId: "p1",
    Name: "Principle One",
    Kurzbezeichnung: "Kurzbezeichnung",
    Kurzbeschreibung: "",
    Hilfetext: "DESC1",
    Erklaerungshilfe: "",
    Nummer: 1,
    order: 1,
    URLBezeichnung: "principle-one",
    Aspekte: [
      {
        Titel: "Aspect P1A1",
        Kurzbezeichnung: "P1A1",
        Text: "P1A1 TEXT",
        Anwendung: [],
      },
      {
        Titel: "Aspect P1A2",
        Kurzbezeichnung: "P1A2",
        Text: "P1A2 TEXT",
        Anwendung: [],
      },
    ],
  },
  {
    documentId: "p2",
    Name: "Principle Two",
    Kurzbezeichnung: "Kurzbezeichnung",
    Kurzbeschreibung: "",
    Hilfetext: "DESC2",
    Erklaerungshilfe: "",
    Nummer: 2,
    order: 2,
    URLBezeichnung: "principle-two",
    Aspekte: [
      {
        Titel: "Aspect P2A1",
        Kurzbezeichnung: "P2A1",
        Text: "P2A1 TEXT",
        Anwendung: [],
      },
      {
        Titel: "Aspect P2A2",
        Kurzbezeichnung: "P2A2",
        Text: "P2A2 TEXT",
        Anwendung: [],
      },
    ],
  },
];

describe("wordDocumentationV2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("buildPrinciplePatches", () => {
    const answers: DocumentationData["principles"] = [
      {
        id: "p1",
        answer: IRRELEVANT_ANSWER,
        reasoning: "r1",
        aspects: [],
      },
      {
        id: "p2",
        answer: POSITIVE_ANSWER,
        reasoning: "positive reasoning",
        aspects: ["p2a1", "p2a2"],
      },
    ];
    const patches = buildPrinciplePatches(prinzips, answers);

    it("creates 6 patch keys per principle", () => {
      expect(Object.keys(patches)).toHaveLength(2 * 6);
    });

    it("creates the correct patches for principle 1 (irrelevant)", () => {
      const p1title = patches["PRINCIPLE_1_TITLE"];
      expect(p1title.type).toBe(PatchType.PARAGRAPH);
      expect(getTextFromTextRun(p1title.children[0])).toBe("Principle One");

      const p1answer = patches["PRINCIPLE_1_ANSWER"];
      expect(getTextFromTextRun(p1answer.children[0])).toBe(IRRELEVANT_ANSWER);

      const p1reasoning = patches["PRINCIPLE_1_REASONING"];
      expect(getTextFromTextRun(p1reasoning.children[0])).toBe("r1");

      const p1aspects = patches["PRINCIPLE_1_ASPECTS"];
      expect(getTextFromTextRun(p1aspects.children[0])).toBe(
        placeholderOptional,
      );
    });

    it("creates the correct patches for principle 2 (positive with aspects)", () => {
      const p2answer = patches["PRINCIPLE_2_ANSWER"];
      expect(getTextFromTextRun(p2answer.children[0])).toBe(POSITIVE_ANSWER);

      const p2reasoning = patches["PRINCIPLE_2_REASONING"];
      expect(getTextFromTextRun(p2reasoning.children[0])).toBe(
        "positive reasoning",
      );

      const p2aspects = patches["PRINCIPLE_2_ASPECTS"];
      expect(getTextFromTextRun(p2aspects.children[0])).toBe("P2A1, P2A2");
    });

    it("creates ASPECTS_AVAILABLE with all aspect names", () => {
      const p1available = patches["PRINCIPLE_1_ASPECTS_AVAILABLE"];
      expect(getTextFromTextRun(p1available.children[0])).toBe("P1A1, P1A2");

      const p2available = patches["PRINCIPLE_2_ASPECTS_AVAILABLE"];
      expect(getTextFromTextRun(p2available.children[0])).toBe("P2A1, P2A2");
    });

    it("creates description patches as DOCUMENT type", () => {
      const p1desc = patches["PRINCIPLE_1_DESCRIPTION"];
      expect(p1desc.type).toBe(PatchType.DOCUMENT);

      const p2desc = patches["PRINCIPLE_2_DESCRIPTION"];
      expect(p2desc.type).toBe(PatchType.DOCUMENT);
    });
  });

  describe("placeholder logic", () => {
    it("uses placeholders when no answer is provided", () => {
      const patches = buildPrinciplePatches(prinzips, undefined);

      const p1answer = patches["PRINCIPLE_1_ANSWER"];
      expect(getTextFromTextRun(p1answer.children[0])).toBe(
        principlePages.radioOptions.join(" | "),
      );

      const p1reasoning = patches["PRINCIPLE_1_REASONING"];
      expect(getTextFromTextRun(p1reasoning.children[0])).toBe(
        placeholderOptional,
      );

      const p1aspects = patches["PRINCIPLE_1_ASPECTS"];
      expect(getTextFromTextRun(p1aspects.children[0])).toBe(
        placeholderOptional,
      );
    });

    it("uses placeholder for aspects when answer is negative", () => {
      const answers: DocumentationData["principles"] = [
        {
          id: "p1",
          answer: NEGATIVE_ANSWER,
          reasoning: "negative reasoning",
          aspects: [],
        },
      ];
      const patches = buildPrinciplePatches(prinzips, answers);

      const p1aspects = patches["PRINCIPLE_1_ASPECTS"];
      expect(getTextFromTextRun(p1aspects.children[0])).toBe(
        placeholderOptional,
      );

      const p1reasoning = patches["PRINCIPLE_1_REASONING"];
      expect(getTextFromTextRun(p1reasoning.children[0])).toBe(
        "negative reasoning",
      );
    });

    it("shows only matching aspects for positive answer", () => {
      const answers: DocumentationData["principles"] = [
        {
          id: "p1",
          answer: POSITIVE_ANSWER,
          reasoning: "r",
          aspects: ["p1a1"], // only first aspect selected
        },
      ];
      const patches = buildPrinciplePatches(prinzips, answers);

      const p1aspects = patches["PRINCIPLE_1_ASPECTS"];
      expect(getTextFromTextRun(p1aspects.children[0])).toBe("P1A1");
    });
  });
});
