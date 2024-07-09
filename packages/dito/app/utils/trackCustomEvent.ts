const plausibleUrl = "https://plausible.io/api/event";
const plausibleDomain = "digitalcheck-dito.prod.ds4g.net";

export default function trackCustomEvent(
  request: Request,
  event: { name: string; props: Record<string, string> },
) {
  if (process.env.NODE_ENV === "development") {
    console.log("TRACKING", event);
    return;
  }
  void fetch(plausibleUrl, {
    method: "POST",
    body: JSON.stringify({
      domain: plausibleDomain,
      url: request.url,
      referrer: request.referrer,
      ...event,
    }),
  });
}
