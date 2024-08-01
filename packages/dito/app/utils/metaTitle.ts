import { MetaMatches } from "@remix-run/react/dist/routeModules";

export default function prependMetaTitle(
  title: string,
  metaMatches: MetaMatches,
): { title: string } {
  const rootMeta = metaMatches?.[0]?.meta?.[0];

  if (
    rootMeta !== undefined &&
    "title" in rootMeta &&
    rootMeta.title !== undefined &&
    typeof rootMeta.title === "string"
  ) {
    return { title: `${title} — ${rootMeta.title}` };
  }

  return { title };
}
