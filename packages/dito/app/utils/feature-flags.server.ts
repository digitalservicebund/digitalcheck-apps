import { initialize } from "unleash-client";

const UNLEASH_API_URL = "https://features.p.digitalservice.dev/api/";
const UNLEASH_APP = "default";
const UNLEASH_KEY = process.env.UNLEASH_KEY ?? "";

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

export { getFeatureToggleDefinitions } from "unleash-client";

export default unleash;
