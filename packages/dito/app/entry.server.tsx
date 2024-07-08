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
import { NonceProvider } from "utils/nonce";

const ABORT_DELAY = 5_000;

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
          reject(error);
        },
        onError() {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            logResponseStatus(responseStatusCode, request, startTime, true);
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
    `default-src 'none'; script-src 'self' https: 'nonce-${nonce}'; style-src 'self'; font-src 'self'; img-src 'self'; frame-ancestors 'self'; connect-src 'self' https://plausible.io`,
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
      logResponseStatus((response as Response).status, request, startTime);
      return response;
    })
    .catch((error) => {
      logResponseStatus(
        500,
        request,
        startTime,
        false,
        (error as Error).message,
      );
      throw error;
    });
}

function logResponseStatus(
  statusCode: number,
  request: Request,
  startTime: number,
  isBot = false,
  error = "",
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
    };
  }

  function logMessage(level: string, message: string) {
    const log = createLog(level, message);
    const logMethod =
      level === "info"
        ? console.log
        : level === "warning"
          ? console.warn
          : console.error;
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
