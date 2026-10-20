import { glob } from "astro/loaders";
import { z } from "astro/zod";
import type { CollectionEntry } from "astro:content";
import { defineCollection, getCollection } from "astro:content";

const prinzipAnwendungSchema = z.object({
  Titel: z.string(),
  Erklaerung: z.string(),
  Formulierungsbeispiel: z.string().optional(),
});

const prinzipAspektSchema = z.object({
  Titel: z.string(),
  Kurzbezeichnung: z.string(),
  Text: z.string(),
  Anwendung: z.array(prinzipAnwendungSchema),
});

const prinzipSchema = z.object({
  documentId: z.string(),
  Name: z.string(),
  Kurzbezeichnung: z.string(),
  Kurzbeschreibung: z.string(),
  Hilfetext: z.string(),
  Erklaerungshilfe: z.string(),
  order: z.number(),
  Nummer: z.number(),
  URLBezeichnung: z.string(),
  Aspekte: z.array(prinzipAspektSchema),
});

const prinzipien = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/prinzipien/" }),
  schema: prinzipSchema,
});

export const collections = { prinzipien };

export type Prinzip = CollectionEntry<"prinzipien">["data"];
export type PrinzipAspekt = Prinzip["Aspekte"][number];
export type PrinzipAnwendung = PrinzipAspekt["Anwendung"][number];

/**
 * Shared getStaticPaths for the [principleId] dokumentation pages
 * (the base page and its /erlaeuterung sibling).
 */
export async function getPrinzipienStaticPaths() {
  const prinzips = (await getCollection("prinzipien")).map(
    (entry) => entry.data,
  );

  return prinzips.map((p) => ({
    params: { principleId: p.URLBezeichnung },
    props: { prinzip: p },
  }));
}
