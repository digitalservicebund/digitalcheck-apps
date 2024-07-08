import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";

import sharedStyles from "@digitalcheck/shared/styles.css?url";
import styles from "./styles.css?url";

import Background from "@digitalcheck/shared/components/Background";
import Breadcrumbs from "@digitalcheck/shared/components/Breadcrumbs";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Footer from "@digitalcheck/shared/components/Footer";
import Header from "@digitalcheck/shared/components/Header";
import PhoneOutlined from "@digitalservicebund/icons/PhoneOutlined";
import { type ReactNode } from "react";
import routes from "resources/allRoutes";
import { header, siteMeta } from "resources/content";
import {
  PATH_A11Y,
  PATH_IMPRINT,
  PATH_LANDING,
  PATH_PRIVACY,
} from "resources/staticRoutes";
import { useNonce } from "utils/nonce";

export const meta: MetaFunction = () => {
  return [{ title: siteMeta.title }];
};

export const headers: HeadersFunction = () => ({
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), midi=(), sync-xhr=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=(), usb=()",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sharedStyles },
  { rel: "stylesheet", href: styles },
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
  <header>
    <div className="h-64 px-16 py-8 flex justify-between items-center">
      <Link to={PATH_LANDING} className="ds-label-01-bold">
        {header.title}
      </Link>
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
);

function Document({
  children,
  error,
}: Readonly<{
  children: ReactNode;
  error?: {
    title: string;
    message: string;
  };
}>) {
  const nonce = useNonce();
  const resultData:
    | {
        positiveQuestions: string[];
        unsureQuestions: string[];
      }
    | undefined = useRouteLoaderData("routes/vorpruefung.ergebnis");
  let resultType: string | undefined;
  // result will only be send to Plausible if the user has reached the result page
  if (resultData) {
    const { positiveQuestions, unsureQuestions } = resultData;
    if (positiveQuestions.length > 0) {
      resultType = "positive";
    } else if (unsureQuestions.length > 0) {
      resultType = "unsure";
    } else {
      resultType = "negative";
    }
  }
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={error ? error.message : siteMeta.description}
        />
        <script
          defer
          // eslint-disable-next-line react/no-unknown-property
          event-result={resultType}
          data-domain="digitalcheck-dito.prod.ds4g.net"
          src="https://plausible.io/js/script.tagged-events.outbound-links.file-downloads.pageview-props.js"
        ></script>
        {error ? <title>{error.title}</title> : <Meta />}
        <Links />
      </head>
      <body>
        <PageHeader includeBreadcrumbs={!error} />
        {children}
        <Footer links={footerLinks} />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <main>
        <Outlet />
      </main>
    </Document>
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
    <Document error={{ title: errorTitle, message: errorMessage }}>
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
            <ButtonContainer className="mt-32">
              <Button
                id="error-back-button"
                text="Zurück zur Startseite"
                href={PATH_LANDING}
                size="large"
                look="tertiary"
              ></Button>
            </ButtonContainer>
          </Container>
        </Background>
      </main>
    </Document>
  );
}
