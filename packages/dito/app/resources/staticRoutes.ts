import { HomeOutlined } from "@digitalservicebund/icons";
import { SVGProps } from "react";

export const PATH_LANDING: string = "/";
export const PATH_PRECHECK: string = "/vorpruefung";
export const PATH_IMPRINT: string = "/impressum";
export const PATH_PRIVACY: string = "/datenschutz";
export const PATH_A11Y: string = "/barrierefreiheit";

export type Route = {
  url: string;
  title: string;
  parent?: string;
  Icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const routes: Route[] = [
  {
    url: PATH_LANDING,
    title: "Startseite",
    Icon: HomeOutlined,
  },
  {
    url: PATH_PRECHECK,
    title: "Digitalbezug einschätzen",
    parent: PATH_LANDING,
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
