import { STRAPI_MEDIA_URL } from "entry.server";

// resource route that proxies our CMS for images
export async function loader({ params }: { params: { url: string } }) {
  const url = new URL(params.url, STRAPI_MEDIA_URL);
  const response = await fetch(url);
  return new Response(response.body, {
    headers: response.headers,
  });
}
