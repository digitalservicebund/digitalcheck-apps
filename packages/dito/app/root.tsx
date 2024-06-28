import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import "@digitalcheck/shared/styles.css";
import "./styles.css";

import Background from "@digitalcheck/shared/components/Background";
import Breadcrumbs from "@digitalcheck/shared/components/Breadcrumbs";
import Container from "@digitalcheck/shared/components/Container";
import Footer from "@digitalcheck/shared/components/Footer";
import Header from "@digitalcheck/shared/components/Header";
import PhoneOutlined from "@digitalservicebund/icons/PhoneOutlined";
import routes from "app/resources/allRoutes";
import { header, siteMeta } from "app/resources/content";
import {
  PATH_A11Y,
  PATH_IMPRINT,
  PATH_PRIVACY,
} from "app/resources/staticRoutes";

export const meta: MetaFunction = () => {
  return [{ title: siteMeta.title }];
};

export const headers: HeadersFunction = () => ({
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self'; frame-ancestors 'self'; connect-src 'self'",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), midi=(), sync-xhr=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=(), usb=()",
});

export const links: LinksFunction = () => [
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

const PageHeader = ({
  includeBreadcrumbs = true,
}: {
  includeBreadcrumbs?: boolean;
}) => (
  <>
    <header>
      <div className="h-64 px-16 py-8 flex justify-between items-center">
        <span className="ds-label-01-bold">{header.title}</span>
        <span className="flex items-center">
          <span className="ds-label-02-reg">{header.contact.msg}</span>
          <PhoneOutlined className="mx-8 w-18" />
          <a
            href={`tel:${header.contact.number}`}
            className="ds-link-01-bold underline text-black"
          >
            {header.contact.number}
          </a>
        </span>
      </div>
      {includeBreadcrumbs && (
        <Background backgroundColor="blue">
          <Breadcrumbs breadcrumbs={routes} useIconForHome />
        </Background>
      )}
    </header>
  </>
);

export default function App() {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={siteMeta.description} />
        <Meta />
        <Links />
      </head>
      <body>
        <PageHeader />
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

export function ErrorBoundary() {
  const error = useRouteError();

  let errorTitle = "Unbekannter Fehler";
  let errorMessage = "Etwas ist schief gelaufen.";

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} — ${error.statusText}`;
    errorMessage = `${error.data}`;
  } else if (error instanceof Error) {
    errorTitle = "Fehler";
    errorMessage = `${error.message}`;
  }

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={errorMessage} />
        <title>{errorTitle}</title>
        <Links />
      </head>
      <body>
        <PageHeader includeBreadcrumbs={false} />
        <main id="error">
          <Background backgroundColor="blue">
            <Container>
              <Header
                heading={{
                  tagName: "h1",
                  text: errorTitle,
                }}
                content={{
                  markdown: errorMessage,
                }}
              />
            </Container>
          </Background>
        </main>
        <Footer links={footerLinks} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
