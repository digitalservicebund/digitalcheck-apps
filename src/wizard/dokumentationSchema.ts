import { z } from "zod";

// Single source of truth for the fields of the Dokumentation: used by the flow
// (page schemas, guards) and by the form components (validation).
// Only depends on zod, so it can be imported anywhere, e.g. in islands.

const text = (message: string) => z.string().trim().min(1, message);

// Labels live next to the values, so the rendered options can't drift from the schema.
export const prinzipAnswerOptions = [
  { value: "yes", label: "Ja, gänzlich oder teilweise" },
  { value: "no", label: "Nein" },
  { value: "not-relevant", label: "Nicht relevant" },
] as const;

const prinzipAnswer = z.enum(
  prinzipAnswerOptions.map((option) => option.value),
  "Bitte wählen Sie eine Option aus.",
);

const schwerpunkteMessage =
  "Bitte wählen Sie mindestens einen Schwerpunkt aus.";
const erklaerungMessage = "Bitte geben Sie eine Erklärung an.";

// Slugs of the Aspekte's Kurzbezeichnung, as in the old Dokumentation
const prinzipSchwerpunkte = z.array(z.string()).min(1, schwerpunkteMessage);

const prinzipErklaerung = text(erklaerungMessage);

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
  [Order in PrinzipOrder as `prinzip${Order}-antwort`]: typeof prinzipAnswer;
} & {
  [
    Order in PrinzipOrder as `prinzip${Order}-schwerpunkte`
  ]: typeof prinzipSchwerpunkte;
} & {
  [
    Order in PrinzipOrder as `prinzip${Order}-erklaerung`
  ]: typeof prinzipErklaerung;
};

export const euInteroperabilitaetOptions = [
  { value: "yes", label: "Ja, Bezug zu EU-Interoperabilität ist vorhanden." },
  { value: "no", label: "Nein, es ist kein Bezug vorhanden." },
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
      [names.antwort, prinzipAnswer],
      [names.schwerpunkte, prinzipSchwerpunkte],
      [names.erklaerung, prinzipErklaerung],
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
    [names.antwort]: prinzipAnswer,
    [names.schwerpunkte]: prinzipSchwerpunkte.optional(),
    [names.erklaerung]: prinzipErklaerung.optional(),
  } as Record<typeof names.antwort, typeof prinzipAnswer> &
    Record<
      typeof names.schwerpunkte,
      z.ZodOptional<typeof prinzipSchwerpunkte>
    > &
    Record<typeof names.erklaerung, z.ZodOptional<typeof prinzipErklaerung>>;

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
