import { removeTrailingSlash } from "@/utils/path";
import { createFlowSession } from "form-graph-engine";
import type { z } from "zod";
import { vorpruefungFlow } from "./vorpruefungFlow";
import { vorpruefungFields } from "./vorpruefungSchema";

export const wizardFlows = {
  vorpruefung: vorpruefungFlow,
} as const;

export type WizardId = keyof typeof wizardFlows;

// Field schemas per wizard, so generic form components can look up their
// field by name. Requires unique field names within a wizard.
export const wizardFields = {
  vorpruefung: vorpruefungFields,
} as const satisfies Record<WizardId, unknown>;

export const getFieldSchema = (wizardId: WizardId, name: string) => {
  const fields: Readonly<Record<string, z.ZodType>> = wizardFields[wizardId];
  if (!Object.hasOwn(fields, name)) {
    throw new Error(`Unknown field "${name}" in wizard "${wizardId}"`);
  }
  return fields[name];
};

type UserData = Parameters<typeof createFlowSession>[1];

// TODO: read from the wizard store once it exists. Until then, guards that
// depend on earlier answers (e.g. the result page) cannot be passed.
export const readUserData = (_wizardId: WizardId): UserData => ({});

export const getWizardSession = (
  wizardId: WizardId,
  pathname: string,
  userData: UserData = {},
) =>
  createFlowSession(
    wizardFlows[wizardId],
    userData,
    removeTrailingSlash(pathname),
  );
