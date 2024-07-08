// the filename is deliberately obscure to prevent it from being blocked

import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { method, body } = request;

  const response = await fetch("https://plausible.io/api/event", {
    body,
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.text();
  const { status, headers } = response;

  return new Response(responseBody, {
    status,
    headers,
  });
};
