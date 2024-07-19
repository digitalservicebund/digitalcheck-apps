import Background from "@digitalcheck/shared/components/Background";
import Breadcrumbs from "@digitalcheck/shared/components/Breadcrumbs";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Footer from "@digitalcheck/shared/components/Footer";
import Header from "@digitalcheck/shared/components/Header";
import sharedStyles from "@digitalcheck/shared/styles.css?url";
import PhoneOutlined from "@digitalservicebund/icons/PhoneOutlined";
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
} from "@remix-run/react";
import { marked, type Tokens } from "marked";
import { type ReactNode } from "react";
import routes from "resources/allRoutes";
import { header, siteMeta } from "resources/content";
import {
  ROUTE_A11Y,
  ROUTE_IMPRINT,
  ROUTE_LANDING,
  ROUTE_PRIVACY,
} from "resources/staticRoutes";
import { useNonce } from "utils/nonce";
import styles from "./styles.css?url";

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

const renderer = new marked.Renderer();
const extension = {
  useNewRenderer: true,
  renderer: {
    link(token: Tokens.Link) {
      const { href } = token;
      const linkHtml = renderer.link.call(this, token);

      if (href.startsWith("mailto")) {
        return linkHtml.replace(
          /^<a /,
          `<a class="plausible-event-name=Mail+Click" `,
        );
      }

      if (href.startsWith("tel")) {
        return linkHtml.replace(
          /^<a /,
          `<a class="plausible-event-name=Phone+Click" `,
        );
      }

      return linkHtml;
    },
  },
};

marked.use(extension);

const footerLinks = [
  { url: ROUTE_IMPRINT.url, text: "Impressum" },
  { url: ROUTE_PRIVACY.url, text: "Datenschutzerklärung" },
  { url: ROUTE_A11Y.url, text: "Barrierefreiheit" },
];

const PageHeader = ({
  includeBreadcrumbs = true,
}: {
  includeBreadcrumbs?: boolean;
}) => (
  <header>
    <div className="min-h-64 p-16 flex justify-between items-center">
      <Link to={ROUTE_LANDING.url} className="ds-label-01-bold">
        {header.title}
      </Link>
      <span className="flex items-center">
        <span className="ds-label-02-reg text-lg max-sm:hidden">
          {header.contact.msg}
        </span>
        <PhoneOutlined className="mx-8 w-18" />
        <a
          href={`tel:${header.contact.number}`}
          className="ds-link-01-bold text-lg underline plausible-event-name=Phone+Click"
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
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={error ? error.message : siteMeta.description}
        />
        <script
          defer
          // TODO: Switch to this when we can figure out how to reliably access selected (opt-in only) server env variables in client code...
          // data-domain={PLAUSIBLE_DOMAIN}
          data-domain="digitalcheck-dito.prod.ds4g.net"
          data-api="/proxy-pl-event"
          src="/proxy-pl-script.js"
        ></script>
        {error ? <title>{error.title}</title> : <Meta />}
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
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
      <main className="grow">
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
      <main id="error" className="grow">
        <Background backgroundColor="blue">
          <Container>
            <Header
              heading={{
                tagName: "h1",
                text: errorTitle,
              }}
              content={{
                markdown: errorMessage,
                className: "md:text-2xl",
              }}
            />
            <ButtonContainer className="mt-32">
              <Button
                id="error-back-button"
                text="Zurück zur Startseite"
                href={ROUTE_LANDING.url}
                look="tertiary"
              ></Button>
            </ButtonContainer>
          </Container>
        </Background>
      </main>
    </Document>
  );
}
