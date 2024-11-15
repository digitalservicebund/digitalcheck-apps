import { getFeatureFlags } from "utils/featureFlags.server";

export const loader = () => {
  const featureFlags = getFeatureFlags();

  return { featureFlags };
};
