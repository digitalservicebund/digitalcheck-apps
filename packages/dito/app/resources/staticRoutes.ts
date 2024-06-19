export const PATH_LANDING: string = "/";
export const PATH_PRECHECK: string = "/vorpruefung";
export const PATH_RESULT: string = PATH_PRECHECK + "/ergebnis";
export const PATH_ASSESSMENT: string = PATH_RESULT + "/einschaetzung";
export const PATH_DOCUMENTATION: string = "/dokumentation";
export const PATH_IMPRINT: string = "/impressum";
export const PATH_PRIVACY: string = "/datenschutz";
export const PATH_A11Y: string = "/barrierefreiheit";

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
    title: "Ergebnis der Vorprüfung",
    parent: PATH_PRECHECK,
  },
  {
    url: PATH_ASSESSMENT,
    title: "Einschätzung als PDF",
    parent: PATH_RESULT,
  },
  // {
  //   url: PATH_IMPRINT,
  //   title: "Impressum",
  //   parent: PATH_LANDING,
  // },
  // {
  //   url: PATH_A11Y,
  //   title: "Barrierefreiheit",
  //   parent: PATH_LANDING,
  // },
  // {
  //   url: PATH_PRIVACY,
  //   title: "Datenschutzerklärung",
  //   parent: PATH_LANDING,
  // },
];

export default routes;
