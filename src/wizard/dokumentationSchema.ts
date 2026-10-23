import { z } from "zod";

// Single source of truth for the fields of the Dokumentation: used by the flow
// (page schemas, guards) and by the form components (validation).
// Only depends on zod, so it can be imported anywhere, e.g. in islands.

const text = (message: string) => z.string().trim().min(1, message);

// Field names are prefixed with their page: user data is one flat object across all pages.
// TODO: add fields of the remaining pages
export const dokumentationFields = {
  "regelungsvorhaben-titel": text("Bitte geben Sie einen Titel ein."),
  "regelungsvorhaben-organisation": text(
    "Bitte geben Sie eine Organisation ein.",
  ),
  "beteiligungsformate-erklaerung": text("Bitte geben Sie eine Antwort."),
  "beteiligungsformate-erkenntnisse": text("Bitte geben Sie eine Antwort."),
} as const;

export type DokumentationField = keyof typeof dokumentationFields;

export const dokumentationSchema = z.object(dokumentationFields);

// Page schemas, shared by the flow and the step's fields (see stepFields)
export const regelungsvorhabenSchema = z.object({
  "regelungsvorhaben-titel": dokumentationFields["regelungsvorhaben-titel"],
  "regelungsvorhaben-organisation":
    dokumentationFields["regelungsvorhaben-organisation"],
});

export const beteiligungsformateSchema = z.object({
  "beteiligungsformate-erklaerung":
    dokumentationFields["beteiligungsformate-erklaerung"],
  "beteiligungsformate-erkenntnisse":
    dokumentationFields["beteiligungsformate-erkenntnisse"],
});
