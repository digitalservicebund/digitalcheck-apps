import { digitalDocumentation } from "@/resources/content/dokumentation";
import type { VersionedData } from "@/utils/localStorageVersioned";
import { z } from "zod";

export const DATA_SCHEMA_VERSION = "2";

const { principlePages, participation, info } = digitalDocumentation;

export const policyTitleSchema = z.object({
  title: z.string().min(1, { message: info.inputTitle.error }),
  organization: z.string().min(1, {
    message: "Bitte geben Sie eine Organisation ein.",
  }),
});

export const participationSchema = z.object({
  formats: z
    .string()
    .min(1, { message: participation.formats.textField.errorMessage }),
  results: z
    .string()
    .min(1, { message: participation.results.textField.errorMessage }),
});

export const EU_INTEROPERABILITY_OUTCOME_IDS = [
  "REQUIRED",
  "NOT_REQUIRED",
] as const;

export const euInteroperabilityOutcomeSchema = z.object({
  outcomeId: z.enum(EU_INTEROPERABILITY_OUTCOME_IDS).optional(),
});

export const euInteroperabilityOutcomeNavigationSchema =
  euInteroperabilityOutcomeSchema
    .extend({
      outcomeId: z.enum(EU_INTEROPERABILITY_OUTCOME_IDS),
    })
    .strict();

export const interoperabilityMetaSchema = z.object({
  publicationStatus: z
    .enum(["published", "planned", ""])
    .refine(Boolean, { message: "Bitte wählen Sie eine Option" }),
  publicationDate: z.string().optional(),
  publicationLink: z.string().optional(),
});

export type InteroperabilityMeta = z.infer<typeof interoperabilityMetaSchema>;

export const principleAnswerOnlySchema = z.object({
  answer: z.enum(
    [
      principlePages.radioOptions[0],
      principlePages.radioOptions[1],
      principlePages.radioOptions[2],
    ],
    { message: principlePages.errors.answerError },
  ),
});

const principlePositiveAnswerSchema = z.object({
  answer: z.literal(principlePages.radioOptions[0]),
  aspects: z
    .array(z.string(), {
      message: "Bitte geben Sie mindestens einen Schwerpunkt an.",
    })
    .min(1, {
      message: "Bitte geben Sie mindestens einen Schwerpunkt an.",
    }),
});

const principleNegativeAnswerSchema = z.object({
  answer: z.literal(principlePages.radioOptions[1]),
  aspects: z.undefined().optional(),
});

const principleIrrelevantAnswerSchema = z.object({
  answer: z.literal(principlePages.radioOptions[2]),
  aspects: z.undefined().optional(),
});

const principleBaseSchema = z.object({
  reasoning: z
    .string()
    .min(1, { message: "Bitte geben Sie eine Erklärung an." }),
});

export const principleAnswerSchema = z
  .discriminatedUnion(
    "answer",
    [
      principlePositiveAnswerSchema,
      principleNegativeAnswerSchema,
      principleIrrelevantAnswerSchema,
    ],
    { message: principlePages.errors.answerError },
  )
  .and(principleBaseSchema);

export const principleSchema = principleAnswerSchema.and(
  z.object({
    id: z.string(),
  }),
);

export const bindingRequirementsSchema = z.object({
  functions: z.array(z.string()),
  requirements: z.array(
    z.object({
      legalReference: z.string().optional(),
      description: z.string().optional(),
      services: z.string().optional(),
      serviceAreas: z.array(z.string()).default([]),
      stakeholderGroups: z.array(z.string()).default([]),
    }),
  ),
});

const bindingRequirementNavigationSchema = z
  .object({
    legalReference: z.string().optional(),
    description: z.string().optional(),
    services: z.string().optional(),
    serviceAreas: z.array(z.string()).default([]),
    stakeholderGroups: z.array(z.string()).default([]),
  })
  .refine(
    (entry) =>
      Boolean(
        entry.legalReference?.trim() ||
        entry.description?.trim() ||
        entry.services?.trim() ||
        entry.serviceAreas.length ||
        entry.stakeholderGroups.length,
      ),
    { message: "Bitte vervollständigen Sie die Anforderung." },
  );

export const bindingRequirementsNavigationSchema = z.object({
  requirements: z.array(bindingRequirementNavigationSchema).min(1),
});

const interoperabilityRatingSchema = z.enum([
  "positive",
  "neutral",
  "risky",
  "not-applicable",
]);

export const interoperabilityAssessmentLevelSchema = z.object({
  detail: z.string().optional(),
  rating: z.union([interoperabilityRatingSchema, z.literal("")]).optional(),
});

export const interoperabilityAssessmentLevelNavigationSchema =
  interoperabilityAssessmentLevelSchema
    .extend({ rating: interoperabilityRatingSchema })
    .superRefine((value, ctx) => {
      if (value.rating !== "not-applicable" && !value.detail?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Bitte geben Sie eine Erklärung an.",
          path: ["detail"],
        });
      }
    });

export const interoperabilityAssessmentSchema = z.object({
  legal: interoperabilityAssessmentLevelSchema,
  organizational: interoperabilityAssessmentLevelSchema,
  semantic: interoperabilityAssessmentLevelSchema,
  technical: interoperabilityAssessmentLevelSchema,
});

export const defaultTitleValues: PolicyTitle = {
  title: "",
  organization: "",
};

export const defaultParticipationValues: Participation = {
  formats: "",
  results: "",
};

export type Principle = z.infer<typeof principleSchema>;

export type PolicyTitle = z.infer<typeof policyTitleSchema>;
export type Participation = z.infer<typeof participationSchema>;
export type EuInteroperabilityOutcome = z.infer<
  typeof euInteroperabilityOutcomeSchema
>;
export type BindingRequirementsData = z.infer<typeof bindingRequirementsSchema>;
export type InteroperabilityAssessmentLevel = z.infer<
  typeof interoperabilityAssessmentLevelSchema
>;
export type InteroperabilityAssessmentData = z.infer<
  typeof interoperabilityAssessmentSchema
>;

export type DocumentationData = {
  policyTitle?: PolicyTitle;
  participation?: Participation;
  euInteroperabilityOutcome?: EuInteroperabilityOutcome;
  bindingRequirements?: BindingRequirementsData;
  interoperabilityAssessment?: Partial<InteroperabilityAssessmentData>;
  interoperabilityMeta?: InteroperabilityMeta;
  principles?: Principle[];
  initialized?: boolean;
} & VersionedData;
