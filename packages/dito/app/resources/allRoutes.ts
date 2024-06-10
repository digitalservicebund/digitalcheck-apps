import { preCheck } from "./content";
import routes, { PATH_PRECHECK, type Route } from "./staticRoutes";

const allRoutes: Route[] = [
  ...routes,
  ...preCheck.questions.map((question) => ({
    ...question,
    parent: PATH_PRECHECK,
  })),
];

export default allRoutes;
