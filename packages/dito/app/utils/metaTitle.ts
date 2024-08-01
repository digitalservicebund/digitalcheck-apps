import { MetaDescriptor } from "@remix-run/node";
import { MetaMatches } from "@remix-run/react/dist/routeModules";

export default function prependMetaTitle(
  title: string,
  metaMatches: MetaMatches,
): MetaDescriptor[] {
  // Get the title of the root metadata, this should always be first in the array
  const rootMeta = metaMatches?.[0]?.meta?.[0];
  // Get other parent metadata, with the exception of title related entries (these will be the first 4 in the array), as we are going to replace them
  const parentMeta = metaMatches.flatMap((match) => match.meta ?? []).slice(4);

  if (
    rootMeta !== undefined &&
    "title" in rootMeta &&
    rootMeta.title !== undefined &&
    typeof rootMeta.title === "string"
  ) {
    const prependedTitle = `${title} — ${rootMeta.title}`;

    return [
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
      ...parentMeta,
    ];
  }

  return [
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
    ...parentMeta,
  ];
}
