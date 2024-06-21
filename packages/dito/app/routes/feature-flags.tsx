import { json } from "@remix-run/node";
import { getFeatureToggleDefinitions } from "feature-flags.server";

export const loader = () => {
  const definitions = getFeatureToggleDefinitions() || [];

  return json({ initialised: definitions.length > 1 });
};
