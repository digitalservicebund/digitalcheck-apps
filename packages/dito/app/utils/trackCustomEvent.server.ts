const plausibleUrl = "https://plausible.io/api/event";
const plausibleDomain = "digitalcheck-dito.prod.ds4g.net";

export default async function trackCustomEvent(
  request: Request,
  event: { name: string; props?: Record<string, string> },
) {
  if (process.env.NODE_ENV === "development") {
    console.log("TRACKING", event);
    return;
  }
  try {
    const response = await fetch(plausibleUrl, {
      method: "POST",
      body: JSON.stringify({
        domain: plausibleDomain,
        url: request.url,
        referrer: request.referrer,
        ...event,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error tracking event: ${response.status}`);
    }
  } catch (error) {
    console.error("Error tracking event", event, error);
  }
}
