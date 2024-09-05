import { initialize } from "unleash-client";
import { UNLEASH_API_URL, UNLEASH_APP, UNLEASH_KEY } from "./constants.server";

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

export const getFeatureFlag = (name: string) => unleash.isEnabled(name);

export const getFeatureFlags = () =>
  Object.fromEntries(
    unleash
      .getFeatureToggleDefinitions()
      .filter((flag) => flag.name.startsWith("digitalcheck."))
      .map((flag) => [flag.name, flag.enabled]),
  );

export default unleash;
