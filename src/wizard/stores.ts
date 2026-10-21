import { createWizardStore } from "./createWizardStore";
import type { WizardId } from "./session";
import { vorpruefungFlow } from "./vorpruefungFlow";
import { vorpruefungFields } from "./vorpruefungSchema";

// New storage key: the flat data doesn't match the legacy "preCheckData".
export const wizardStores = {
  vorpruefung: createWizardStore(
    "vorpruefungData",
    vorpruefungFlow,
    vorpruefungFields,
  ),
} as const satisfies Record<WizardId, unknown>;
