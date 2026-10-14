import { interoperabel } from "@/config/routes";

export const interopsAnchors = {
  bindingRequirements: "verbindliche-anforderungen",
  fourLevels: "vier-ebenen-der-interoperabilitaet",
} as const;

export const interopsAssessment = {
  path: `${interoperabel.path}#${interopsAnchors.bindingRequirements}`,
} as const;
