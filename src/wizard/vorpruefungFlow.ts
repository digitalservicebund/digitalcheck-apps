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
import { vorpruefungFields, vorpruefungSchema } from "./vorpruefungSchema";

const allQuestionsAnswered = (data: unknown) =>
  vorpruefungSchema.safeParse(data).success;

// Each question has its own page in src/pages/vorpruefung/, so the paths come
// from the generated routes. Their literal types let form-graph-engine infer
// the page schema per path.
// Page schemas only pick fields from vorpruefungFields, don't define them inline.
export const vorpruefungFlow = compileFlowConfig({
  pages: {
    itSystem: {
      path: vorpruefung_itSystem.path,
      pageSchema: { "it-system": vorpruefungFields["it-system"] },
    },
    verpflichtungenFuerBeteiligte: {
      path: vorpruefung_verpflichtungenFuerBeteiligte.path,
      pageSchema: {
        "verpflichtungen-fuer-beteiligte":
          vorpruefungFields["verpflichtungen-fuer-beteiligte"],
      },
    },
    datenaustausch: {
      path: vorpruefung_datenaustausch.path,
      pageSchema: { datenaustausch: vorpruefungFields.datenaustausch },
    },
    kommunikation: {
      path: vorpruefung_kommunikation.path,
      pageSchema: { kommunikation: vorpruefungFields.kommunikation },
    },
    automatisierung: {
      path: vorpruefung_automatisierung.path,
      pageSchema: { automatisierung: vorpruefungFields.automatisierung },
    },
    euBezug: {
      path: vorpruefung_euBezug.path,
      pageSchema: { "eu-bezug": vorpruefungFields["eu-bezug"] },
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
