import { vorpruefung, vorpruefung_ergebnis } from "@/config/routes";
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

// Question pages are rendered by the dynamic route src/pages/vorpruefung/[questionId].astro
// and therefore missing in routes.ts, so their paths are derived from the question ids.
// Literal path types let form-graph-engine infer the page schema per path.
const questionPath = <Id extends QuestionId>(questionId: Id) =>
  `${vorpruefung.path}/${questionId}` as const;

const answer = z.enum(
  ["yes", "no", "unsure"],
  "Bitte wählen Sie eine Option aus.",
);

const allQuestionsAnswered = (data: Partial<Record<QuestionId, unknown>>) =>
  questionIds.every((id) => answer.safeParse(data[id]).success);

// Field names are the question ids: user data is one flat object across all pages.
export const vorpruefungFlow = compileFlowConfig({
  pages: {
    itSystem: {
      path: questionPath("it-system"),
      pageSchema: { "it-system": answer },
    },
    verpflichtungenFuerBeteiligte: {
      path: questionPath("verpflichtungen-fuer-beteiligte"),
      pageSchema: { "verpflichtungen-fuer-beteiligte": answer },
    },
    datenaustausch: {
      path: questionPath("datenaustausch"),
      pageSchema: { datenaustausch: answer },
    },
    kommunikation: {
      path: questionPath("kommunikation"),
      pageSchema: { kommunikation: answer },
    },
    automatisierung: {
      path: questionPath("automatisierung"),
      pageSchema: { automatisierung: answer },
    },
    euBezug: {
      path: questionPath("eu-bezug"),
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
