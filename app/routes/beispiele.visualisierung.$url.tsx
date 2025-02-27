import { STRAPI_MEDIA_URL } from "~/entry.server";

// Resource route that proxies our CMS for images
export async function loader({ params }: { params: { url: string } }) {
  const cmsUrl = new URL(params.url, STRAPI_MEDIA_URL);
  const cmsResponse = await fetch(cmsUrl);

  const response = new Response(cmsResponse.body, {
    headers: cmsResponse.headers,
  });

  // Remove Content-Encoding header for SVG files as they aren't gzipped
  if (params.url.endsWith(".svg")) {
    response.headers.delete("Content-Encoding");
  }

  return response;
}
