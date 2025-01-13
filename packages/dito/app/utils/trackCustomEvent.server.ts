import { PLAUSIBLE_DOMAIN, PLAUSIBLE_URL } from "./constants.server";
import logResponseStatus from "./logging";

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

  let response: Response | null = null;
  let statusCode = 200;
  let errorMessage = "";

  try {
    response = await fetch(PLAUSIBLE_URL, {
      method: "POST",
      body: JSON.stringify({
        domain: PLAUSIBLE_DOMAIN,
        url: request.url,
        referrer: request.referrer,
        ...event,
      }),
    });

    if (!response.ok) {
      throw new FetchError(
        `Error tracking event: ${response.statusText}`,
        response.status,
      );
    }
  } catch (error) {
    statusCode = error instanceof FetchError ? error.status : 500;
    errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error tracking event", event, error);
  } finally {
    logResponseStatus(
      response ? response.status : statusCode,
      request,
      startTime,
      false,
      errorMessage,
      "external",
    );
  }
}
