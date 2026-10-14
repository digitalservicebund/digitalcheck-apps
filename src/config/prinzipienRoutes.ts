import { prinzipien, type Route } from "@/config/routes";

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
