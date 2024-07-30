export const PLAUSIBLE_URL = "https://plausible.io/api/event";
export const PLAUSIBLE_DOMAIN = "erarbeiten.digitalcheck.bund.de";
export const PLAUSIBLE_SCRIPT =
  "https://plausible.io/js/script.tagged-events.outbound-links.js";

export const UNLEASH_API_URL = "https://features.p.digitalservice.dev/api/";
export const UNLEASH_APP = "default";
// BEWARE: 👇 This won't be available in any client-only files
export const UNLEASH_KEY = process?.env?.UNLEASH_KEY ?? "";
