export const PATH_LANDING: string = "/";
export const PATH_PRECHECK: string = "/vorpruefung";
export const PATH_RESULT: string = `${PATH_PRECHECK}/ergebnis`;
export const PATH_ASSESSMENT: string = `${PATH_RESULT}/einschaetzung`;
export const PATH_METHODS = "/methoden";
export const PATH_METHODS_RESPONSIBLE_ACTORS = `${PATH_METHODS}/zustaendige-akteurinnen`;
export const PATH_METHODS_TASKS_PROCESSES = `${PATH_METHODS}/ablaeufe-aufgaben-erfassen`;
export const PATH_METHODS_COLLECT_IT_SYSTEMS = `${PATH_METHODS}/it-systeme-erfassen`;
export const PATH_METHODS_FIVE_PRINCIPALS: string = `${PATH_METHODS}/fuenf-prinzipien`;
export const PATH_METHODS_TECHNICAL_FEASIBILITY = `${PATH_METHODS}/technische-umsetzbarkeit`;
export const PATH_IMPRINT: string = "/impressum";
export const PATH_PRIVACY: string = "/datenschutz";
export const PATH_A11Y: string = "/barrierefreiheit";
export const PATH_PRECHECK_PDF: string =
  "/download/digitalcheck-vorpruefung.pdf";
export const PATH_DOCUMENTATION_PDF: string =
  "/download/digitalcheck-begleitende-dokumentation.pdf";

export type Route = {
  url: string;
  title: string;
  parent?: string;
};

const routes: Route[] = [
  {
    url: PATH_LANDING,
    title: "Startseite",
  },
  {
    url: PATH_PRECHECK,
    title: "Vorprüfung",
    parent: PATH_LANDING,
  },
  {
    url: PATH_RESULT,
    title: "Ergebnis",
    parent: PATH_PRECHECK,
  },
  {
    url: PATH_ASSESSMENT,
    title: "Einschätzung als PDF",
    parent: PATH_RESULT,
  },
  {
    url: PATH_PRECHECK_PDF,
    title: "Digitalcheck Vorprüfung",
  },
  {
    url: PATH_DOCUMENTATION_PDF,
    title: "Begleitendede Dokumentation",
  },
  {
    url: PATH_METHODS,
    title: "Regelungsvorhaben erarbeiten",
    parent: PATH_LANDING,
  },
  {
    url: PATH_METHODS_RESPONSIBLE_ACTORS,
    title: "Zuständige Akteurinnen und Akteure auflisten",
    parent: PATH_METHODS,
  },
  {
    url: PATH_METHODS_TASKS_PROCESSES,
    title: "Aufgaben und Abläufe gemeinsam erfassen",
    parent: PATH_METHODS,
  },
  {
    url: PATH_METHODS_COLLECT_IT_SYSTEMS,
    title: "IT-Systeme gemeinsam erfassen",
    parent: PATH_METHODS,
  },
  {
    url: PATH_METHODS_FIVE_PRINCIPALS,
    title: "Fünf Prinzipien für digitaltaugliche Gesetzgebung",
    parent: PATH_METHODS,
  },
  {
    url: PATH_METHODS_TECHNICAL_FEASIBILITY,
    title: "Technische Umsetzbarkeit sicherstellen",
    parent: PATH_METHODS,
  },
  {
    url: PATH_IMPRINT,
    title: "Impressum",
    parent: PATH_LANDING,
  },
  {
    url: PATH_A11Y,
    title: "Barrierefreiheit",
    parent: PATH_LANDING,
  },
  {
    url: PATH_PRIVACY,
    title: "Datenschutzerklärung",
    parent: PATH_LANDING,
  },
];

export default routes;
