/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import crypto from "node:crypto";
import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import logResponseStatus from "~/utils/logging";
import { NonceProvider } from "~/utils/nonce";

if (
  process.env.MOCK_EXTERNAL_APIS === "true" &&
  process.env.NODE_ENV !== "production"
) {
  const { mockServer } = await import("./mocks/node");
  console.warn("Mock external APIs.");
  mockServer.listen({
    onUnhandledRequest(request, print) {
      const url = new URL(request.url);

      if (url.hostname.includes("strapiapp.com")) {
        return;
      }

      print.warning();
    },
  });
}

// Reject/cancel all pending promises after 5 seconds
export const streamTimeout = 5000;

export const STRAPI_MEDIA_URL =
  process.env.STRAPI_MEDIA_URL ||
  "https://secure-dinosaurs-1a634d1a3d.media.strapiapp.com";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  const startTime = Date.now();
  const isReadinessCheck =
    request.headers.get("X-Readiness-Check") === "readiness-check";
  const userAgent = request.headers.get("user-agent");

  if (isReadinessCheck || isbot(userAgent)) {
    return handleBotRequest(
      request,
      responseStatusCode,
      responseHeaders,
      reactRouterContext,
      startTime,
    );
  } else {
    return handleBrowserRequest(
      request,
      responseStatusCode,
      responseHeaders,
      reactRouterContext,
      startTime,
    );
  }
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  startTime: number,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onAllReady() {
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
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(error);
        },
        onError() {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            logResponseStatus(
              responseStatusCode,
              request,
              startTime,
              true,
              "",
              "regular",
            );
          }
        },
      },
    );

    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  startTime: number,
) {
  const nonce = crypto.randomBytes(16).toString("hex");

  responseHeaders.set(
    "Content-Security-Policy",
    `default-src 'none'; script-src 'self' https: 'nonce-${nonce}'; style-src 'self'; font-src 'self'; img-src 'self' ${STRAPI_MEDIA_URL} data:; frame-ancestors 'self' https://calendar.google.com https://calendar.app.google; frame-src 'self' https://calendar.google.com; connect-src 'self' https://plausible.io`,
  );

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <ServerRouter
          context={reactRouterContext}
          url={request.url}
          nonce={nonce}
        />
      </NonceProvider>,
      {
        nonce,
        onShellReady() {
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
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  })
    .then((response) => {
      logResponseStatus(
        (response as Response).status,
        request,
        startTime,
        false,
        "",
        "regular",
      );
      return response;
    })
    .catch((error) => {
      logResponseStatus(
        500,
        request,
        startTime,
        false,
        (error as Error).message,
        "regular",
      );
      throw error;
    });
}
