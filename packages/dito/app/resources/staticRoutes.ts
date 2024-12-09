const PRE_CHECK_PDF = "digitalcheck-vorpruefung.pdf";
const DOCUMENTATION_PDF = "digitalcheck-begleitende-dokumentation.pdf";
export const TOOLFINDER = "https://visualisieren.digitalcheck.bund.de/";

export type Route = {
  url: string;
  title: string;
  parent?: string;
};

export const ROUTE_LANDING: Route = {
  url: "/",
  title: "Startseite",
};
export const ROUTE_PRECHECK_STATIC_PDF: Route = {
  url: `/download/${PRE_CHECK_PDF}`,
  title: "Vorprüfung als PDF",
};

export const ROUTE_PRECHECK: Route = {
  url: "/vorpruefung",
  title: "Vorprüfung",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_RESULT: Route = {
  url: `${ROUTE_PRECHECK.url}/ergebnis`,
  title: "Ergebnis",
  parent: ROUTE_PRECHECK.url,
};
export const ROUTE_RESULT_PDF: Route = {
  url: `${ROUTE_RESULT.url}/${PRE_CHECK_PDF}`,
  title: "Vorprüfung als PDF",
  parent: ROUTE_RESULT.url,
};
export const ROUTE_METHODS: Route = {
  url: "/methoden",
  title: "Regelung erarbeiten",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_METHODS_RESPONSIBLE_ACTORS: Route = {
  url: `${ROUTE_METHODS.url}/zustaendige-akteurinnen-auflisten`,
  title: "Akteure auflisten",
  parent: ROUTE_METHODS.url,
};
export const ROUTE_METHODS_TASKS_PROCESSES: Route = {
  url: `${ROUTE_METHODS.url}/ablaeufe-aufgaben-erfassen`,
  title: "Abläufe erfassen",
  parent: ROUTE_METHODS.url,
};
export const ROUTE_METHODS_COLLECT_IT_SYSTEMS: Route = {
  url: `${ROUTE_METHODS.url}/it-systeme-erfassen`,
  title: "IT-Systeme erfassen",
  parent: ROUTE_METHODS.url,
};
export const ROUTE_METHODS_FIVE_PRINCIPLES: Route = {
  url: `${ROUTE_METHODS.url}/fuenf-prinzipien`,
  title: "Fünf Prinzipien",
  parent: ROUTE_METHODS.url,
};
export const ROUTE_METHODS_TECHNICAL_FEASIBILITY: Route = {
  url: `${ROUTE_METHODS.url}/technische-umsetzbarkeit`,
  title: "Technische Umsetzbarkeit sicherstellen",
  parent: ROUTE_METHODS.url,
};

export const ROUTE_DOCUMENTATION: Route = {
  url: "/dokumentation",
  title: "Dokumentation",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_DOCUMENTATION_STATIC_PDF: Route = {
  url: `/download/${DOCUMENTATION_PDF}`,
  title: "Begleitende Dokumentation als PDF",
};

export const ROUTE_SUPPORT: Route = {
  url: "/unterstuetzung",
  title: "Unterstützungsangebote",
  parent: ROUTE_LANDING.url,
};

export const ROUTE_IMPRINT: Route = {
  url: "/impressum",
  title: "Impressum",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_PRIVACY: Route = {
  url: "/datenschutz",
  title: "Datenschutzerklärung",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_A11Y: Route = {
  url: "/barrierefreiheit",
  title: "Barrierefreiheit",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_SITEMAP: Route = {
  url: "/sitemap",
  title: "Sitemap",
  parent: ROUTE_LANDING.url,
};
export const ROUTE_EXAMPLES: Route = {
  url: "/beispiele",
  title: "Beispiele für Digitaltauglichkeit",
  parent: ROUTE_LANDING.url,
};

export const ROUTE_PRINCIPLES: Route = {
  url: `${ROUTE_EXAMPLES.url}/prinzipien`,
  title: "Prinzipien",
  parent: ROUTE_EXAMPLES.url,
};

export const ROUTE_LAWS: Route = {
  url: `${ROUTE_EXAMPLES.url}/regelungen`,
  title: "Gesetze",
  parent: ROUTE_EXAMPLES.url,
};

const routes: Route[] = [
  ROUTE_LANDING,
  ROUTE_PRECHECK,
  ROUTE_RESULT,
  ROUTE_METHODS,
  ROUTE_METHODS_RESPONSIBLE_ACTORS,
  ROUTE_METHODS_TASKS_PROCESSES,
  ROUTE_METHODS_COLLECT_IT_SYSTEMS,
  ROUTE_METHODS_FIVE_PRINCIPLES,
  ROUTE_METHODS_TECHNICAL_FEASIBILITY,
  ROUTE_SUPPORT,
  ROUTE_DOCUMENTATION,
  ROUTE_IMPRINT,
  ROUTE_PRIVACY,
  ROUTE_A11Y,
  ROUTE_SITEMAP,
  ROUTE_EXAMPLES,
];

export default routes;
