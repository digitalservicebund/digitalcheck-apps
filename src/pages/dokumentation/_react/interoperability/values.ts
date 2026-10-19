import type {
  EU_INTEROPERABILITY_OUTCOME_IDS,
  InteroperabilityAssessmentData,
  InteroperabilityAssessmentLevel,
} from "@/pages/dokumentation/_react/documentationDataSchema.ts";
import { keyValueToMap } from "@/utils/keyValue.ts";

export type Option = {
  value: string;
  label: string;
};
export const serviceAreaOptions: readonly Option[] = [
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
export const stakeholderOptions: readonly Option[] = [
  {
    value: "localPublicSectorBody",
    label: "Öffentliche Stelle (Kommunen / lokal)",
  },
  {
    value: "regionalPublicSectorBody",
    label: "Öffentliche Stelle (Länder / regional)",
  },
  {
    value: "nationalPublicSectorBody",
    label: "Öffentliche Stelle (Bund / national)",
  },
  {
    value: "europeanUnionInstitution",
    label: "EU-Institution",
  },
  { value: "europeanUnionAgency", label: "EU-Agentur" },
  { value: "europeanUnionBody", label: "EU-Einrichtung" },
  { value: "privateBusinesses", label: "Private Unternehmen" },
] as const;

export const interoperabilityRatingOptions: Option[] = [
  {
    label: "Ja, gänzlich oder teilweise",
    value: "positive",
  },
  {
    label: "Nein",
    value: "risky",
  },
  {
    label: "Nicht relevant",
    value: "not-applicable",
  },
];
const ratingMap = keyValueToMap(interoperabilityRatingOptions);

export const interoperabilityRatingPlaceholder = interoperabilityRatingOptions
  .map((option) => option.label)
  .join(" | ");

export function formatRating(
  rating?: InteroperabilityAssessmentLevel["rating"],
) {
  if (!rating) {
    return undefined;
  }
  return ratingMap.get(rating);
}

export const defaultAssessmentValues: InteroperabilityAssessmentData = {
  legal: { detail: "", rating: "" },
  organizational: { detail: "", rating: "" },
  semantic: { detail: "", rating: "" },
  technical: { detail: "", rating: "" },
};

export const publicationStatusQuestion = {
  questionLabel:
    "Wann soll der Referentenentwurf voraussichtlich auf der Webseite Ihres Ministeriums veröffentlicht werden?",
  questionLabelShort: "Geplante Veröffentlichung",
  options: [
    {
      label: "Die Veröffentlichung ist geplant am...",
      value: "planned",
    },
    {
      label: "Der Referentenentwurf ist bereits veröffentlicht",
      value: "published",
    },
  ] satisfies Option[],
};

export const publicationDateQuestion = {
  questionLabel: "Voraussichtliches Veröffentlichungsdatum",
};

export const publicationLinkQuestion = {
  questionLabel: "Link zum Referentenentwurf",
};

export const euInteroperabilityQuestion = {
  label: "Ergab die Vorprüfung Bezug zur EU-Interoperabilität?",
  options: [
    {
      value: "REQUIRED",
      label: "Ja, Bezug zur EU-Interoperabilität ist vorhanden.",
    },
    {
      value: "NOT_REQUIRED",
      label: "Nein, es ist kein Bezug vorhanden.",
    },
  ] as const satisfies {
    label: string;
    value: (typeof EU_INTEROPERABILITY_OUTCOME_IDS)[number];
  }[],
};
