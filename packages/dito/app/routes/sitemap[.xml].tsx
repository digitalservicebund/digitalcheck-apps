import allRoutes from "resources/allRoutes";

const BASE_URL = process.env.BASE_URL ?? "";

export const loader = () => {
  const urls = allRoutes.map((route) => `${BASE_URL}${route.url}`);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  >
    ${urls.map((url) => `<url><loc>${url}</loc></url>`).join("\n")}
  </urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
