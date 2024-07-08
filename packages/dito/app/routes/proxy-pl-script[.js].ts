// the filename is deliberately obscure to prevent it from being blocked
// from https://rogerstringer.com/blog/proxying-plausible-in-remix

const plausibleUrl =
  "https://plausible.io/js/script.tagged-events.outbound-links.file-downloads.pageview-props.js";

export const loader = async () => {
  const response = await fetch(plausibleUrl);
  const script = await response.text();
  const { status } = response;

  return new Response(script, { status });
};
