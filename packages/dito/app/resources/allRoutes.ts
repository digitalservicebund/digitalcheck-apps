import { SVGProps } from "react";
import routes from "./allRoutes";
import { precheck } from "./content";
import { PATH_PRECHECK } from "./staticRoutes";

export type Route = {
  url: string;
  parent?: string;
} & (
  | { title: string }
  | { Icon: React.ComponentType<SVGProps<SVGSVGElement>> }
);

const allRoutes: Route[] = [
  ...routes,
  ...precheck.questions.map((question) => ({
    ...question,
    parent: PATH_PRECHECK,
  })),
];

export default allRoutes;
