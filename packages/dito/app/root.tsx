import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import Footer from "@digitalcheck/shared/components/Footer";
import sharedStyles from "@digitalcheck/shared/styles.css?url";
import { header } from "resources/content";
import { PATH_A11Y, PATH_IMPRINT, PATH_PRIVACY } from "resources/routes";
import styles from "./styles.css?url";

import PhoneOutlined from "@digitalservicebund/icons/PhoneOutlined";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: sharedStyles },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  {
    rel: "icon",
    href: "/favicon_32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "icon",
    href: "/favicon_64.png",
    type: "image/png",
    sizes: "64x64",
  },
];

const footerLinks = [
  { url: PATH_IMPRINT, text: "Impressum" },
  { url: PATH_PRIVACY, text: "Datenschutzerklärung" },
  { url: PATH_A11Y, text: "Barrierefreiheit" },
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
        <header className="p-8 w-100 flex justify-between">
          <span className="font-semibold">{header.title}</span>
          <span className="flex">
            {header.contact.msg}
            <PhoneOutlined className="mx-8" />
            {header.contact.number}
          </span>
        </header>
        <Outlet />
        <Footer links={footerLinks} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
