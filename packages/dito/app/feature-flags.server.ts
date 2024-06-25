import { initialize } from "unleash-client";

const unleash = initialize({
  url: process.env.UNLEASH_API_URL ?? "",
  appName: process.env.UNLEASH_APP ?? "",
  customHeaders: {
    Authorization: process.env.UNLEASH_KEY ?? "",
  },
});

unleash.on("ready", console.log);
unleash.on("synchronized", console.log);
unleash.on("error", console.error);
unleash.on("warn", console.warn);

export { getFeatureToggleDefinitions } from "unleash-client";

export default unleash;
