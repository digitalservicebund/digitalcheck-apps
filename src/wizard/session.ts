import { removeTrailingSlash } from "@/utils/path";
import { createFlowSession } from "form-graph-engine";
import { vorpruefungFlow } from "./vorpruefungFlow";

export const wizardFlows = {
  vorpruefung: vorpruefungFlow,
} as const;

export type WizardId = keyof typeof wizardFlows;

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
