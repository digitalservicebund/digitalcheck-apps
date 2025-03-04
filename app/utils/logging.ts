export default function logResponseStatus(
  statusCode: number,
  request: Request,
  startTime: number,
  isBot = false,
  error = "",
  source = "regular",
) {
  const timestamp = new Date().toISOString();
  const duration = Date.now() - startTime;

  function createLog(level: string, message: string) {
    return {
      level,
      message,
      statusCode,
      url: request.url,
      method: request.method,
      timestamp,
      isBot,
      duration,
      source,
    };
  }

  function logMessage(level: string, message: string) {
    const log = createLog(level, message);
    const logMethod =
      {
        info: console.log,
        warning: console.warn,
        error: console.error,
      }[level] ?? console.error;
    logMethod(JSON.stringify(log));
  }

  if (statusCode >= 200 && statusCode < 300) {
    logMessage("info", "HTTP successful response");
  } else if (statusCode >= 400 && statusCode < 500) {
    logMessage("warning", error || "HTTP warning response");
  } else if (statusCode >= 500 && error) {
    logMessage("error", error);
  }
}
