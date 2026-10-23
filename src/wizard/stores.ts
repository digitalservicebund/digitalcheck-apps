import { createWizardStore } from "./createWizardStore";
import { dokumentationFlow } from "./dokumentationFlow";
import { dokumentationFields } from "./dokumentationSchema";
import type { WizardId } from "./session";
import { vorpruefungFlow } from "./vorpruefungFlow";
import { vorpruefungFields } from "./vorpruefungSchema";

// New storage keys: the flat data doesn't match the legacy "preCheckData"
// and "documentationData".
export const wizardStores = {
  vorpruefung: createWizardStore(
    "vorpruefungData",
    vorpruefungFlow,
    vorpruefungFields,
  ),
  dokumentation: createWizardStore(
    "dokumentationData",
    dokumentationFlow,
    dokumentationFields,
  ),
} as const satisfies Record<WizardId, unknown>;
