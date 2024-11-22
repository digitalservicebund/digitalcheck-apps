import { preCheck } from "./content";
import routes, {
  ROUTE_PRECHECK,
  ROUTE_PRINCIPLES,
  type Route,
} from "./staticRoutes";

// TODO: use remix breadcrumbs: https://remix.run/docs/ja/main/guides/breadcrumbs
const principles = [
  {
    slug: "digitale-kommunikation-sicherstellen",
    title: "Prinzip 1 in Regelungstexten",
  },
  {
    slug: "wiederverwendung-von-daten-und-standards-ermoeglichen",
    title: "Prinzip 2 in Regelungstexten",
  },
  {
    slug: "datenschutz-und-informationssicherheit-gewaehrleisten",
    title: "Prinzip 3 in Regelungstexten",
  },
  {
    slug: "klare-regelungen-fuer-eine-digitale-ausfuehrung-finden",
    title: "Prinzip 4 in Regelungstexten",
  },
  {
    slug: "automatisierung-ermoeglichen",
    title: "Prinzip 5 in Regelungstexten",
  },
];

const allRoutes: Route[] = [
  ...routes,
  ...principles.map(({ slug, title }) => ({
    url: `${ROUTE_PRINCIPLES.url}/${slug}`,
    title,
    parent: ROUTE_PRINCIPLES.url,
  })),
  ...preCheck.questions.map((question) => ({
    ...question,
    parent: ROUTE_PRECHECK.url,
  })),
];

export default allRoutes;
