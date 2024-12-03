import { initialize } from "unleash-client";
import { UNLEASH_API_URL, UNLEASH_APP, UNLEASH_KEY } from "./constants.server";

const unleash = initialize({
  url: UNLEASH_API_URL,
  appName: UNLEASH_APP,
  customHeaders: {
    Authorization: UNLEASH_KEY,
  },
});
const DEFAULT_FLAG_STATE = true;
let unleashInitialized = false;

unleash.on("ready", console.log);
unleash.on("synchronized", () => {
  unleashInitialized = true;
  console.log("Unleash is initialized.");
});
unleash.on("error", console.error);
unleash.on("warn", console.warn);

export const getFeatureFlag = (name: string): boolean => {
  if (!unleashInitialized) {
    console.warn(
      `[WebServer] Unleash not initialized. Defaulting "${name}" to ${DEFAULT_FLAG_STATE}.`,
    );
    return DEFAULT_FLAG_STATE;
  }

  const isEnabled = unleash.isEnabled(name);
  return isEnabled !== undefined ? isEnabled : DEFAULT_FLAG_STATE;
};

export const getFeatureFlags = () =>
  Object.fromEntries(
    unleash
      .getFeatureToggleDefinitions()
      .filter((flag) => flag.name.startsWith("digitalcheck."))
      .map((flag) => [flag.name, flag.enabled]),
  );

export default unleash;
