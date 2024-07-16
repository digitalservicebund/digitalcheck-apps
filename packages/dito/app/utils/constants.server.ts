export const BASE_URL =
  process?.env?.BASE_URL ?? "https://digitalcheck.bund.de";

export const PLAUSIBLE_URL = "https://plausible.io/api/event";
export const PLAUSIBLE_DOMAIN = BASE_URL.replace(/https?:\/\//i, "");

export const UNLEASH_API_URL = "https://features.p.digitalservice.dev/api/";
export const UNLEASH_APP = "default";
export const UNLEASH_KEY = process.env.UNLEASH_KEY ?? "";
