import { MetaDescriptor } from "@remix-run/node";
import { MetaMatches } from "@remix-run/react/dist/routeModules";

export default function prependMetaTitle(
  title: string,
  metaMatches: MetaMatches,
): MetaDescriptor[] {
  const parentMeta = metaMatches.flatMap((match) => match.meta ?? []);
  const rootMeta = metaMatches?.[0]?.meta?.[0];

  if (
    rootMeta !== undefined &&
    "title" in rootMeta &&
    rootMeta.title !== undefined &&
    typeof rootMeta.title === "string"
  ) {
    const prependedTitle = `${title} — ${rootMeta.title}`;
    return [
      ...parentMeta,
      { title: prependedTitle },
      {
        property: "title",
        content: prependedTitle,
      },
      {
        property: "og:title",
        content: prependedTitle,
      },
      {
        property: "twitter:title",
        content: prependedTitle,
      },
    ];
  }

  return [
    ...parentMeta,
    { title },
    {
      property: "title",
      content: title,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "twitter:title",
      content: title,
    },
  ];
}
