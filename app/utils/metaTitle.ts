import type { MetaArgs, MetaDescriptor } from "react-router";

export default function prependMetaTitle(
  title: string,
  metaMatches: MetaArgs["matches"],
): MetaDescriptor[] {
  // Get the title of the root metadata, this should always be first in the array
  const rootMeta = metaMatches[0].meta?.[0];
  // Only get direct parent metadata, as it includes all meta tags
  // Only reuse tags that are not title-related meta tags, as we are going to replace those
  const parentMeta = metaMatches[metaMatches.length - 2].meta?.filter(
    (meta) =>
      !(
        "title" in meta ||
        ("property" in meta &&
          (meta.property === "title" ||
            meta.property === "og:title" ||
            meta.property === "twitter:title"))
      ),
  );

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
