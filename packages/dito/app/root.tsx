import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import Breadcrumbs from "@digitalcheck/shared/components/Breadcrumbs";
import Footer from "@digitalcheck/shared/components/Footer";
import sharedStyles from "@digitalcheck/shared/styles.css?url";
import {
  header,
  PATH_A11Y,
  PATH_IMPRINT,
  PATH_PRIVACY,
  ROUTES,
  siteMeta,
} from "resources/content";
import styles from "./styles.css?url";

import Background from "@digitalcheck/shared/components/Background";
import PhoneOutlined from "@digitalservicebund/icons/PhoneOutlined";

export const meta: MetaFunction = () => {
  return [
    { title: siteMeta.title },
    {
      name: "description",
      content: siteMeta.description,
    },
  ];
};

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
        <header>
          <div className="h-64 px-16 py-8 flex justify-between items-center">
            <span className="ds-label-01-bold">{header.title}</span>
            <span className="flex items-center">
              <span className="ds-label-02-reg">{header.contact.msg}</span>
              <PhoneOutlined className="mx-8 w-18" />
              <span className="ds-link-01-bold">{header.contact.number}</span>
            </span>
          </div>
          <Background backgroundColor="blue">
            <Breadcrumbs breadcrumbs={ROUTES} />
          </Background>
        </header>
        <main>
          <Outlet />
        </main>
        <Footer links={footerLinks} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
