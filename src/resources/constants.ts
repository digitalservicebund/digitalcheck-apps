export const PRE_CHECK_START_BUTTON_ID = "preCheck-start-button";

export const PRINCIPLE_COLORS = {
  1: { background: "bg-principle-1", border: "border-principle-1" },
  2: { background: "bg-principle-2", border: "border-principle-2" },
  3: { background: "bg-principle-3", border: "border-principle-3" },
  4: { background: "bg-principle-4", border: "border-principle-4" },
  5: { background: "bg-principle-5", border: "border-principle-5" },
  6: { background: "bg-principle-6", border: "border-principle-6" },
} as const;

export type PrincipleNumber = keyof typeof PRINCIPLE_COLORS;

export const ZFL_BASE_URL = "https://zfl.bund.de";

// Paths for pages that were moved to the Zentrum für Legistik (ZfL).
// Used both by the redirects in astro.config.mjs and by internal links
// pointing to the same content.
export const ZFL_PATH_BEISPIELE = "/werkzeuge/digitaltauglichkeit/beispiele";
export const ZFL_PATH_VISUALISIERUNGEN =
  "/werkzeuge/ressourcen/visualisierungen";
export const ZFL_PATH_DIGITALTAUGLICHKEIT = "/werkzeuge/digitaltauglichkeit";
export const ZFL_PATH_INTERVIEW_LEITFADEN =
  "/werkzeuge/ressourcen/interviewleitfaden";
export const ZFL_PATH_IT_SYSTEME = "/werkzeuge/ressourcen/it-systeme";
export const ZFL_PATH_TECHNISCHE_UMSETZBARKEIT =
  "/werkzeuge/ressourcen/technische-umsetzbarkeit";
export const ZFL_PATH_FLUSSDIAGRAMME = "/werkzeuge/ressourcen/flussdiagramme";
export const ZFL_PATH_RESSOURCEN = "/werkzeuge/ressourcen";
export const ZFL_PATH_SCHULUNGEN = "/schulungen";
