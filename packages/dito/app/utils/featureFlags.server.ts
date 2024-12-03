import { initialize } from "unleash-client";
import { UNLEASH_API_URL, UNLEASH_APP, UNLEASH_KEY } from "./constants.server";

const DEFAULT_FLAG_STATE = true;

const unleash = initialize({
  url: UNLEASH_API_URL,
  appName: UNLEASH_APP,
  customHeaders: {
    Authorization: UNLEASH_KEY,
  },
});

unleash.on("ready", console.log);
unleash.on("synchronized", console.log);
unleash.on("error", console.error);
unleash.on("warn", console.warn);

export const getFeatureFlag = (name: string) => {
  const isEnabled = unleash.isEnabled(name);
  return isEnabled !== undefined ? isEnabled : DEFAULT_FLAG_STATE;
};

export const getFeatureFlags = () => {
  const definitions = unleash.getFeatureToggleDefinitions();
  if (!definitions || definitions.length === 0) {
    console.warn("No feature flags found, using defaults");
    return { "default.all": DEFAULT_FLAG_STATE };
  }

  return Object.fromEntries(
    definitions
      .filter((flag) => flag.name.startsWith("digitalcheck."))
      .map((flag) => [
        flag.name,
        flag.enabled !== undefined ? flag.enabled : DEFAULT_FLAG_STATE,
      ]),
  );
};

export default unleash;
