/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import crypto from "node:crypto";
import { PassThrough } from "node:stream";

import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import logResponseStatus from "utils/logging";
import { NonceProvider } from "utils/nonce";

const ABORT_DELAY = 5_000;
export const STRAPI_MEDIA_URL =
  process.env.STRAPI_MEDIA_URL ||
  "https://secure-dinosaurs-1a634d1a3d.media.strapiapp.com";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
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
      remixContext,
      startTime,
    );
  } else {
    return handleBrowserRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      startTime,
    );
  }
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  startTime: number,
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

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
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
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </NonceProvider>,
      {
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

    setTimeout(abort, ABORT_DELAY);
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
