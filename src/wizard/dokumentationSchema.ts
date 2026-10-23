import { z } from "zod";

// Single source of truth for the fields of the Dokumentation: used by the flow
// (page schemas, guards) and by the form components (validation).
// Only depends on zod, so it can be imported anywhere, e.g. in islands.

const text = (message: string) => z.string().trim().min(1, message);

// Labels live next to the values, so the rendered options can't drift from the schema.
// Answers to "Schafft das Regelungsvorhaben die rechtlichen Voraussetzungen …?"
// for the Prinzipien and the levels of interoperability
export const bewertungOptions = [
  { value: "yes", label: "Ja, gänzlich oder teilweise" },
  { value: "no", label: "Nein" },
  { value: "not-relevant", label: "Nicht relevant" },
] as const;

export type Bewertung = (typeof bewertungOptions)[number]["value"];

const bewertung = z.enum(
  bewertungOptions.map((option) => option.value),
  "Bitte wählen Sie eine Option aus.",
);

const schwerpunkteMessage =
  "Bitte wählen Sie mindestens einen Schwerpunkt aus.";
const erklaerungMessage = "Bitte geben Sie eine Erklärung an.";

// Slugs of the Aspekte's Kurzbezeichnung, as in the old Dokumentation
const prinzipSchwerpunkte = z.array(z.string()).min(1, schwerpunkteMessage);

const erklaerung = text(erklaerungMessage);

// The Prinzip pages share one route, their fields are numbered by the
// Prinzip's order, like their pages in the flow (prinzip1 to prinzip5).
const prinzipOrders = [1, 2, 3, 4, 5] as const;

export type PrinzipOrder = (typeof prinzipOrders)[number];

/** Narrows the order from the content, which has to match the fields here */
export const toPrinzipOrder = (order: number) => {
  if (!prinzipOrders.includes(order as PrinzipOrder)) {
    throw new Error(`The Dokumentation has no fields for Prinzip ${order}.`);
  }
  return order as PrinzipOrder;
};

export const prinzipFieldNames = <Order extends PrinzipOrder>(order: Order) =>
  ({
    antwort: `prinzip${order}-antwort`,
    schwerpunkte: `prinzip${order}-schwerpunkte`,
    erklaerung: `prinzip${order}-erklaerung`,
  }) as const;

type PrinzipFields = {
  [Order in PrinzipOrder as `prinzip${Order}-antwort`]: typeof bewertung;
} & {
  [
    Order in PrinzipOrder as `prinzip${Order}-schwerpunkte`
  ]: typeof prinzipSchwerpunkte;
} & {
  [Order in PrinzipOrder as `prinzip${Order}-erklaerung`]: typeof erklaerung;
};

export const euInteroperabilitaetOptions = [
  { value: "yes", label: "Ja, Bezug zu EU-Interoperabilität ist vorhanden." },
  { value: "no", label: "Nein, es ist kein Bezug vorhanden." },
] as const;

// The levels of interoperability share their fields and page, prefixed with
// their page
const ebenen = [
  "rechtlich",
  "organisatorisch",
  "semantisch",
  "technisch",
] as const;

export type Ebene = (typeof ebenen)[number];

export const ebeneFieldNames = <E extends Ebene>(ebene: E) =>
  ({
    bewertung: `${ebene}-bewertung`,
    erklaerung: `${ebene}-erklaerung`,
  }) as const;

type EbeneFields = {
  [E in Ebene as `${E}-bewertung`]: typeof bewertung;
} & {
  [E in Ebene as `${E}-erklaerung`]: typeof erklaerung;
};

const ebeneFields = Object.fromEntries(
  ebenen.flatMap((ebene) => {
    const names = ebeneFieldNames(ebene);
    return [
      [names.bewertung, bewertung],
      [names.erklaerung, erklaerung],
    ];
  }),
) as EbeneFields;

export const veroeffentlichungOptions = [
  { value: "planned", label: "Die Veröffentlichung ist geplant am..." },
  {
    value: "published",
    label: "Der Referentenentwurf ist bereits veröffentlicht",
  },
] as const;

// The same options as in the old Dokumentation
export const bereichOptions = [
  { value: "defense", label: "Verteidigung" },
  { value: "economicAffairs", label: "Wirtschaftliche Angelegenheiten" },
  { value: "education", label: "Bildung" },
  { value: "environmentalProtection", label: "Umweltschutz" },
  { value: "generalPublicServices", label: "Allgemeine öffentliche Dienste" },
  { value: "health", label: "Gesundheit" },
  {
    value: "housingAndCommunityAmenities",
    label: "Wohnungswesen und kommunale Einrichtungen",
  },
  {
    value: "publicOrderAndSafety",
    label: "Öffentliche Ordnung und Sicherheit",
  },
  {
    value: "recreationCultureAndReligion",
    label: "Freizeit, Kultur und Religion",
  },
  { value: "socialProtection", label: "Sozialschutz" },
] as const;

// One box of the Verbindliche Anforderungen, read as "" or [] while empty. Empty
// boxes are valid here, so they don't keep the other boxes from being saved.
export const anforderungSchema = z.object({
  titel: z.string(),
  rechtsgrundlage: z.string(),
  dienste: z.string(),
  bereiche: z.array(z.enum(bereichOptions.map((option) => option.value))),
  betroffene: z.string(),
});

const prinzipFields = Object.fromEntries(
  prinzipOrders.flatMap((order) => {
    const names = prinzipFieldNames(order);
    return [
      [names.antwort, bewertung],
      [names.schwerpunkte, prinzipSchwerpunkte],
      [names.erklaerung, erklaerung],
    ];
  }),
) as PrinzipFields;

// Field names are prefixed with their page: user data is one flat object across all pages.
// TODO: add fields of the remaining pages
export const dokumentationFields = {
  "regelungsvorhaben-titel": text("Bitte geben Sie einen Titel ein."),
  "regelungsvorhaben-organisation": text(
    "Bitte geben Sie eine Organisation ein.",
  ),
  "beteiligungsformate-erklaerung": text("Bitte geben Sie eine Antwort."),
  "beteiligungsformate-erkenntnisse": text("Bitte geben Sie eine Antwort."),
  ...prinzipFields,
  "eu-interoperabilitaet-bezug": z.enum(
    euInteroperabilitaetOptions.map((option) => option.value),
    "Bitte wählen Sie eine Option aus.",
  ),
  "verbindliche-anforderungen": z.array(anforderungSchema),
  ...ebeneFields,
  "veroeffentlichung-status": z.enum(
    veroeffentlichungOptions.map((option) => option.value),
    "Bitte wählen Sie eine Option aus.",
  ),
  "veroeffentlichung-datum": text("Bitte geben Sie ein Datum an."),
} as const;

export type DokumentationField = keyof typeof dokumentationFields;

export const dokumentationSchema = z.object(dokumentationFields);

// Page schemas, shared by the flow and the step's fields (see stepFields)
export const regelungsvorhabenSchema = z.object({
  "regelungsvorhaben-titel": dokumentationFields["regelungsvorhaben-titel"],
  "regelungsvorhaben-organisation":
    dokumentationFields["regelungsvorhaben-organisation"],
});

export const beteiligungsformateSchema = z.object({
  "beteiligungsformate-erklaerung":
    dokumentationFields["beteiligungsformate-erklaerung"],
  "beteiligungsformate-erkenntnisse":
    dokumentationFields["beteiligungsformate-erkenntnisse"],
});

/** Page schema of the Prinzip with the given order */
export const prinzipSchema = <Order extends PrinzipOrder>(order: Order) => {
  const names = prinzipFieldNames(order);
  // Computed keys are typed as `string`, so their literal types are restored here
  const shape = {
    [names.antwort]: bewertung,
    [names.schwerpunkte]: prinzipSchwerpunkte.optional(),
    [names.erklaerung]: erklaerung.optional(),
  } as Record<typeof names.antwort, typeof bewertung> &
    Record<
      typeof names.schwerpunkte,
      z.ZodOptional<typeof prinzipSchwerpunkte>
    > &
    Record<typeof names.erklaerung, z.ZodOptional<typeof erklaerung>>;

  // Schwerpunkte (only for "yes") and Erklärung depend on the answer, like their
  // <ShowIf>s on the page. Hidden fields are missing, shown but empty ones are
  // invalid on their own, so this only catches answers stored without them.
  return z.object(shape).superRefine((data, ctx) => {
    const values: Record<string, unknown> = data;
    const answer = values[names.antwort];
    if (answer === "yes" && values[names.schwerpunkte] === undefined) {
      ctx.addIssue({
        code: "custom",
        message: schwerpunkteMessage,
        path: [names.schwerpunkte],
      });
    }
    if (answer !== undefined && values[names.erklaerung] === undefined) {
      ctx.addIssue({
        code: "custom",
        message: erklaerungMessage,
        path: [names.erklaerung],
      });
    }
  });
};

export const euInteroperabilitaetSchema = z.object({
  "eu-interoperabilitaet-bezug":
    dokumentationFields["eu-interoperabilitaet-bezug"],
});

const anforderungenMessage =
  "Bitte geben Sie mindestens eine verbindliche Anforderung an.";

export const verbindlicheAnforderungenSchema = z.object({
  "verbindliche-anforderungen": z
    .array(
      anforderungSchema.refine(
        (anforderung) =>
          Object.values(anforderung).some((value) =>
            typeof value === "string" ? value.trim() : value.length,
          ),
        "Bitte füllen Sie mindestens ein Feld der Anforderung aus.",
      ),
      anforderungenMessage,
    )
    .min(1, anforderungenMessage),
});

/**
 * Page schema of a level of interoperability (e.g. Rechtlich): the Erklärung
 * is only asked for "yes" and "no", like its <ShowIf> on the page.
 */
const ebeneSchema = <E extends Ebene>(ebene: E) => {
  const names = ebeneFieldNames(ebene);
  // Computed keys are typed as `string`, so their literal types are restored here
  const shape = {
    [names.bewertung]: bewertung,
    [names.erklaerung]: erklaerung.optional(),
  } as Record<typeof names.bewertung, typeof bewertung> &
    Record<typeof names.erklaerung, z.ZodOptional<typeof erklaerung>>;

  // Hidden fields are missing, shown but empty ones are invalid on their own,
  // so this only catches answers stored without an Erklärung
  return z.object(shape).superRefine((data, ctx) => {
    const values: Record<string, unknown> = data;
    const answer = values[names.bewertung];
    if (answer !== "not-relevant" && values[names.erklaerung] === undefined) {
      ctx.addIssue({
        code: "custom",
        message: erklaerungMessage,
        path: [names.erklaerung],
      });
    }
  });
};

// Through `unknown`, as the entries' types don't keep their level
export const ebeneSchemas = Object.fromEntries(
  ebenen.map((ebene) => [ebene, ebeneSchema(ebene)]),
) as unknown as { [E in Ebene]: ReturnType<typeof ebeneSchema<E>> };

// The date is optional, as in the old Dokumentation: an approximate one is
// enough, and only asked for "planned"
export const veroeffentlichungSchema = z.object({
  "veroeffentlichung-status": dokumentationFields["veroeffentlichung-status"],
  "veroeffentlichung-datum": z.string().optional(),
});
