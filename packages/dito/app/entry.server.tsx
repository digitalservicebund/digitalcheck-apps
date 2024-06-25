/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { sendAlert } from "./alerting";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return isbot(request.headers.get("user-agent"))
    ? handleRequestWithMode(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        true,
      )
    : handleRequestWithMode(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        false,
      );
}

function handleRequestWithMode(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  isBot: boolean,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [isBot ? "onAllReady" : "onShellReady"]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          void sendAlert({
            labels: {
              alertname: "ShellError",
              severity: "critical",
            },
            annotations: {
              summary: "Shell error occurred during rendering",
              description: (error as Error).message,
            },
            startsAt: new Date().toISOString(),
            endsAt: new Date(new Date().getTime() + 5 * 60000).toISOString(),
          });
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
            void sendAlert({
              labels: {
                alertname: "RenderError",
                severity: "critical",
              },
              annotations: {
                summary: "Rendering error occurred",
                description: (error as Error).message,
              },
              startsAt: new Date().toISOString(),
              endsAt: new Date(new Date().getTime() + 5 * 60000).toISOString(),
            });
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);

    if (responseStatusCode >= 400 && responseStatusCode < 600) {
      console.error("404 Not Found: ", request.url);
      void sendAlert({
        labels: {
          alertname: `${responseStatusCode}Error`,
          severity: responseStatusCode >= 500 ? "critical" : "warning",
        },
        annotations: {
          summary: "404 Not Found",
          description: `A 404 error occurred while handling the request for ${request.url}`,
        },
        startsAt: new Date().toISOString(),
        endsAt: new Date(new Date().getTime() + 5 * 60000).toISOString(),
      });
    }
  });
}
