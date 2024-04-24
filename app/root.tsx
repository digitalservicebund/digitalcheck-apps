import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import fontRegular from "~/../public/fonts/BundesSansWeb-Regular.woff2";
import fontBold from "~/../public/fonts/BundesSansWeb-Bold.woff2";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: fontRegular,
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: fontBold,
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
