import { removeTrailingSlash } from "@/utils/path";
import { createFlowSession } from "form-graph-engine";
import type { z } from "zod";
import { dokumentationFlow } from "./dokumentationFlow";
import { dokumentationFields } from "./dokumentationSchema";
import { vorpruefungFlow } from "./vorpruefungFlow";
import { vorpruefungFields } from "./vorpruefungSchema";

export const wizardFlows = {
  vorpruefung: vorpruefungFlow,
  dokumentation: dokumentationFlow,
} as const;

export type WizardId = keyof typeof wizardFlows;

// Field schemas per wizard, so generic form components can look up their
// field by name. Requires unique field names within a wizard.
export const wizardFields = {
  vorpruefung: vorpruefungFields,
  dokumentation: dokumentationFields,
} as const satisfies Record<WizardId, unknown>;

export const getFieldSchema = (wizardId: WizardId, name: string) => {
  const fields: Readonly<Record<string, z.ZodType>> = wizardFields[wizardId];
  if (!Object.hasOwn(fields, name)) {
    throw new Error(`Unknown field "${name}" in wizard "${wizardId}"`);
  }
  return fields[name];
};

// The wizard a page belongs to, e.g. to mark its pages in the sidebar.
export const getWizardIdForPath = (pathname: string): WizardId | undefined =>
  (Object.keys(wizardFlows) as WizardId[]).find((wizardId) =>
    wizardFlows[wizardId].getNodeKeyFromPath(removeTrailingSlash(pathname)),
  );

type UserData = Parameters<typeof createFlowSession>[1];

// One factory per wizard, as createFlowSession can't infer its config
// from a union of flows.
const sessionFactories = {
  vorpruefung: (userData: UserData, path: string) =>
    createFlowSession(vorpruefungFlow, userData, path),
  dokumentation: (userData: UserData, path: string) =>
    createFlowSession(dokumentationFlow, userData, path),
} as const satisfies Record<WizardId, unknown>;

// For the build, where no user data is known. In the browser, use
// $session from wizardStores, which reads the stored data.
export const getWizardSession = (
  wizardId: WizardId,
  pathname: string,
  userData: UserData = {},
) => sessionFactories[wizardId](userData, removeTrailingSlash(pathname));
