import { preCheck } from "./content";
import routes, { ROUTE_PRECHECK, type Route } from "./staticRoutes";

const allRoutes: Route[] = [
  ...routes,
  ...preCheck.questions.map((question) => ({
    ...question,
    parent: ROUTE_PRECHECK.url,
  })),
];

export default allRoutes;
