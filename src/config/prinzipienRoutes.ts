import {
  assistent_dokumentation,
  prinzipien,
  type Route,
} from "@/config/routes";

type PrinzipFrontmatter = {
  Name: string;
  Kurzbezeichnung: string;
  URLBezeichnung: string;
  order: number;
};

// astro-route-generator skips dynamic routes, so the routes for
// prinzipien/[principleId].astro are derived from the content files instead.
const frontmatters = import.meta.glob<PrinzipFrontmatter>(
  "/src/content/prinzipien/*.md",
  { eager: true, import: "frontmatter" },
);

export const prinzipienRoutes: Route[] = Object.values(frontmatters).map(
  ({ Name, Kurzbezeichnung, URLBezeichnung, order }) => ({
    key: `prinzipien_${URLBezeichnung}`,
    path: `${prinzipien.path}/${URLBezeichnung}`,
    title: Name,
    parent: prinzipien,
    sitemap: true,
    isStagingOnly: false,
    navOrder: order,
    navLabel: `Prinzip ${order}: ${Kurzbezeichnung}`,
  }),
);

// Same for assistent/dokumentation/[principleId].astro
export const dokumentationPrinzipienRoutes: Route[] = Object.values(
  frontmatters,
).map(({ Name, URLBezeichnung, order }) => ({
  key: `assistent_dokumentation_${URLBezeichnung}`,
  path: `${assistent_dokumentation.path}/${URLBezeichnung}`,
  title: Name,
  parent: assistent_dokumentation,
  sitemap: false,
  isStagingOnly: false,
  // after Regelungsvorhaben (1) and Beteiligungsformate (2)
  navOrder: order + 2,
  navLabel: `Prinzip ${order}`,
}));
