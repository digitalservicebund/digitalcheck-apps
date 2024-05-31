import HomeOutlined from "@digitalservicebund/icons/HomeOutlined";

export const PATH_LANDING: string = "/";
export const PATH_IMPRINT: string = "/impressum";
export const PATH_PRIVACY: string = "/datenschutz";
export const PATH_A11Y: string = "/barrierefreiheit";

export const ROUTES = [
  {
    url: PATH_LANDING,
    Icon: HomeOutlined,
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
