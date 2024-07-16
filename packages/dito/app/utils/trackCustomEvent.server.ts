import { PLAUSIBLE_DOMAIN, PLAUSIBLE_URL } from "./constants.server";
import logResponseStatus from "./logging.ts";

class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export default async function trackCustomEvent(
  request: Request,
  event: { name: string; props?: Record<string, string> },
) {
  const startTime = Date.now();
  if (process.env.NODE_ENV === "development") {
    console.log("TRACKING", event);
    return;
  }
  try {
    const response = await fetch(PLAUSIBLE_URL, {
      method: "POST",
      body: JSON.stringify({
        domain: PLAUSIBLE_DOMAIN,
        url: request.url,
        referrer: request.referrer,
        ...event,
      }),
    });
    logResponseStatus(
      response.status,
      request,
      startTime,
      false,
      "",
      "external",
    );
    if (!response.ok) {
      throw new FetchError(
        `Error tracking event: ${response.statusText}`,
        response.status,
      );
    }
  } catch (error) {
    const statusCode = error instanceof FetchError ? error.status : 500;
    const errorMessage = error instanceof Error ? error.message : String(error);
    logResponseStatus(
      statusCode,
      request,
      startTime,
      false,
      errorMessage,
      "external",
    );
    console.error("Error tracking event", event, error);
  }
}
