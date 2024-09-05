import { json } from "@remix-run/node";
import { getFeatureFlags } from "utils/featureFlags.server";

export const loader = () => {
  const featureFlags = getFeatureFlags();

  return json({ featureFlags });
};
