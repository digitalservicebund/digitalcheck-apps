import { initialize } from "unleash-client";
import { UNLEASH_API_URL, UNLEASH_APP, UNLEASH_KEY } from "./constants.server";

const isCI = process.env.CI === "true";

const silentLogger = {
  log: () => {},
  error: () => {},
  warn: () => {},
};

const logger = isCI ? silentLogger : console;

const unleash = initialize({
  url: UNLEASH_API_URL,
  appName: UNLEASH_APP,
  customHeaders: {
    Authorization: UNLEASH_KEY,
  },
});

const DEFAULT_FLAG_STATE = true;

unleash.on("ready", logger.log);
unleash.on("synchronized", () => {
  logger.log("Unleash is initialized.");
});
unleash.on("error", logger.error);
unleash.on("warn", logger.warn);

export const getFeatureFlags = () => {
  if (isCI) {
    console.warn(
      `Defaulting all feature flags to ${DEFAULT_FLAG_STATE} in CI.`,
    );
    return DEFAULT_FLAG_STATE;
  }
  return Object.fromEntries(
    unleash
      .getFeatureToggleDefinitions()
      .filter((flag) => flag.name.startsWith("digitalcheck."))
      .map((flag) => [flag.name, flag.enabled]),
  );
};
