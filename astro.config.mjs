// @ts-check
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { generateRoutes } from "astro-route-generator";
import { defineConfig } from "astro/config";
import process from "node:process";
import Icons from "unplugin-icons/vite";
import {
  ZFL_BASE_URL,
  ZFL_PATH_BEISPIELE,
  ZFL_PATH_FLUSSDIAGRAMME,
  ZFL_PATH_INTERVIEW_LEITFADEN,
  ZFL_PATH_IT_SYSTEME,
  ZFL_PATH_TECHNISCHE_UMSETZBARKEIT,
  ZFL_PATH_VISUALISIERUNGEN,
} from "./src/resources/constants.ts";

const isPreview = process.env.PUBLIC_STAGE === "preview";
const PREVIEW_BASE_PATH = process.env.PREVIEW_BASE_PATH;

const PRODUCTION_SITE = "https://digitalcheck.bund.de";
const PREVIEW_SITE = "https://digitalservicebund.github.io";

const base = isPreview ? PREVIEW_BASE_PATH : undefined;

const rawRedirects = {
  "/interoperabel/faq": "/interoperabel",
  "/grundlagen": "/prinzipien",
  "/grundlagen/digitaltauglichkeit": "/#was-ist-digitaltauglichkeit",
  "/grundlagen/normenkontrollrat": "/normenkontrollrat",
  "/interoperabel?tab=angrenzendes-eu-recht":
    "/interoperabel/angrenzendes-eu-recht",
  "/grundlagen/fuenf-prinzipien": "/prinzipien",
  "/methoden/fuenf-prinzipien": "/prinzipien",
  // Not a dynamic [principleId] redirect, as Astro drops `base` from those
  "/methoden/fuenf-prinzipien/digitale-angebote-fuer-alle-nutzbar-gestalten":
    "/prinzipien/digitale-angebote-fuer-alle-nutzbar-gestalten",
  "/methoden/fuenf-prinzipien/datenwiederverwendung-benoetigt-einheitliches-recht":
    "/prinzipien/datenwiederverwendung-benoetigt-einheitliches-recht",
  "/methoden/fuenf-prinzipien/etablierte-technologien-ermoeglichen-effiziente-umsetzung":
    "/prinzipien/etablierte-technologien-ermoeglichen-effiziente-umsetzung",
  "/methoden/fuenf-prinzipien/automatisierung-basiert-auf-eindeutigen-regelungen":
    "/prinzipien/automatisierung-basiert-auf-eindeutigen-regelungen",
  "/methoden/fuenf-prinzipien/datenschutz-und-informationssicherheit-schaffen-vertrauen":
    "/prinzipien/datenschutz-und-informationssicherheit-schaffen-vertrauen",
  "/unterstuetzung": "/kontakt",
};

// Some pages were moved to the Zentrum für Legistik
const zflRedirects = {
  "/beispiele/prinzipien/digitale-angebote-fuer-alle-nutzbar-gestalten": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}#prinzip-1`,
  "/beispiele/prinzipien/datenwiederverwendung-benoetigt-einheitliches-recht": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}#prinzip-2`,
  "/beispiele/prinzipien/etablierte-technologien-ermoeglichen-effiziente-umsetzung": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}#prinzip-3`,
  "/beispiele/prinzipien/automatisierung-basiert-auf-eindeutigen-regelungen": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}#prinzip-4`,
  "/beispiele/prinzipien/datenschutz-und-informationssicherheit-schaffen-vertrauen": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}#prinzip-5`,
  "beispiele/prinzipien": `${ZFL_BASE_URL}${ZFL_PATH_BEISPIELE}`,
  "/beispiele/visualisierungen": `${ZFL_BASE_URL}${ZFL_PATH_VISUALISIERUNGEN}`,
  "/methoden/interview-leitfaden": `${ZFL_BASE_URL}${ZFL_PATH_INTERVIEW_LEITFADEN}`,
  "/methoden/interview-leitfaden-schritte": `${ZFL_BASE_URL}${ZFL_PATH_INTERVIEW_LEITFADEN}`,
  "/methoden/zustaendige-akteurinnen-auflisten": `${ZFL_BASE_URL}${ZFL_PATH_INTERVIEW_LEITFADEN}#halten-sie-die-akteurinnen-und-akteure-in-einer-uebersicht-fest`,
  "/methoden/it-systeme-erfassen": `${ZFL_BASE_URL}${ZFL_PATH_IT_SYSTEME}`,
  "/methoden/technische-umsetzbarkeit": `${ZFL_BASE_URL}${ZFL_PATH_TECHNISCHE_UMSETZBARKEIT}`,
  "/methoden/visualisieren": `${ZFL_BASE_URL}${ZFL_PATH_FLUSSDIAGRAMME}`,
  "/methoden/visualisieren/flussdiagramm": `${ZFL_BASE_URL}${ZFL_PATH_FLUSSDIAGRAMME}`,
  "/methoden/ablaeufe-aufgaben-erfassen": `${ZFL_BASE_URL}/werkzeuge/ressourcen/flussdiagramm`,
};

const redirects = {
  ...Object.fromEntries(
    Object.entries(rawRedirects).map(([from, to]) => [from, (base ?? "") + to]),
  ),
  ...zflRedirects,
};

export default defineConfig({
  output: "static",
  site: isPreview ? PREVIEW_SITE : PRODUCTION_SITE,
  base,
  redirects,
  srcDir: "src",
  publicDir: "public",
  integrations: [
    react(),
    alpinejs(),
    mdx(),
    sitemap(),
    generateRoutes({
      pagesDir: "src/pages",
      output: "src/config/routes.ts",
      downloadsDir: "public/documents",
      downloadsOutput: "src/config/downloads.ts",
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Renders Iconify icons (e.g. from @iconify-json/ic) as Astro components
      Icons({ compiler: "astro" }),
    ],
    resolve: {
      alias: {
        "@/": new URL("./src/", import.meta.url).pathname,
      },
    },
  },
  build: {
    assets: "_astro",
  },
  prefetch: {
    prefetchAll: true,
  },
  security: {
    csp: false,
  },
  trailingSlash: "never",
});
