import {
  vorpruefung_automatisierung,
  vorpruefung_datenaustausch,
  vorpruefung_ergebnis,
  vorpruefung_euBezug,
  vorpruefung_itSystem,
  vorpruefung_kommunikation,
  vorpruefung_verpflichtungenFuerBeteiligte,
} from "@/config/routes";
import { compileFlowConfig } from "form-graph-engine";
import { z } from "zod";

const questionIds = [
  "it-system",
  "verpflichtungen-fuer-beteiligte",
  "datenaustausch",
  "kommunikation",
  "automatisierung",
  "eu-bezug",
] as const;

type QuestionId = (typeof questionIds)[number];

const answer = z.enum(
  ["yes", "no", "unsure"],
  "Bitte wählen Sie eine Option aus.",
);

const allQuestionsAnswered = (data: Partial<Record<QuestionId, unknown>>) =>
  questionIds.every((id) => answer.safeParse(data[id]).success);

// Each question has its own page in src/pages/vorpruefung/, so the paths come
// from the generated routes. Their literal types let form-graph-engine infer
// the page schema per path.
// Field names are the question ids: user data is one flat object across all pages.
export const vorpruefungFlow = compileFlowConfig({
  pages: {
    itSystem: {
      path: vorpruefung_itSystem.path,
      pageSchema: { "it-system": answer },
    },
    verpflichtungenFuerBeteiligte: {
      path: vorpruefung_verpflichtungenFuerBeteiligte.path,
      pageSchema: { "verpflichtungen-fuer-beteiligte": answer },
    },
    datenaustausch: {
      path: vorpruefung_datenaustausch.path,
      pageSchema: { datenaustausch: answer },
    },
    kommunikation: {
      path: vorpruefung_kommunikation.path,
      pageSchema: { kommunikation: answer },
    },
    automatisierung: {
      path: vorpruefung_automatisierung.path,
      pageSchema: { automatisierung: answer },
    },
    euBezug: {
      path: vorpruefung_euBezug.path,
      pageSchema: { "eu-bezug": answer },
    },
    ergebnis: { path: vorpruefung_ergebnis.path },
  },
  transitions: {
    itSystem: "verpflichtungenFuerBeteiligte",
    verpflichtungenFuerBeteiligte: "datenaustausch",
    datenaustausch: "kommunikation",
    kommunikation: "automatisierung",
    automatisierung: "euBezug",
    euBezug: [{ guard: allQuestionsAnswered, target: "ergebnis" }],
    ergebnis: null,
  },
  initialStep: "itSystem",
});
