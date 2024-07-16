import { json } from "@remix-run/node";
import unleash, {
  getFeatureToggleDefinitions,
} from "utils/featureFlags.server";

export const loader = () => {
  const definitions = getFeatureToggleDefinitions() || [];
  const testFeatureFlag = unleash.isEnabled("digitalcheck.test-feature-flags");

  return json({ initialised: definitions.length > 1, testFeatureFlag });
};
