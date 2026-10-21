import { preCheckResult } from "@/resources/content/vorpruefung-ergebnis";
import { answerValues } from "@/wizard/vorpruefungSchema";
import { z } from "zod";
import { ResultType } from "./PreCheckResult";

export const answerSchema = z.object({
  questionId: z.string(),
  // Typed as string like before, the legacy form and its tests rely on that
  answer: z.enum<readonly string[]>(
    answerValues,
    "Bitte wählen Sie eine Option aus.",
  ),
});

const resultTitleSchema = z
  .string()
  .min(1, { message: preCheckResult.form.vorhabenTitleRequired })
  .max(100, { message: preCheckResult.form.vorhabenTitleTooLong });

const resultNegativeReasoningSchema = z
  .string()
  .min(1, { message: preCheckResult.form.reasonRequired })
  .max(500, { message: preCheckResult.form.reasonTooLong });

const negativeResultSchema = z.object({
  result: z.literal(ResultType.NEGATIVE),
  title: resultTitleSchema,
  negativeReasoning: resultNegativeReasoningSchema,
});

const positiveResultSchema = z.object({
  result: z.literal(ResultType.POSITIVE),
  title: resultTitleSchema,
  negativeReasoning: z.literal(""),
});

const unsureResultSchema = z.object({
  result: z.literal(ResultType.UNSURE),
  title: z.literal(""),
  negativeReasoning: z.literal(""),
});

export const resultSchema = z.discriminatedUnion("result", [
  positiveResultSchema,
  negativeResultSchema,
  unsureResultSchema,
]);

export const schema = z
  .object({
    answers: z.array(answerSchema),
  })
  .and(resultSchema);

export type PreCheckAnswerSchema = z.infer<typeof answerSchema>;
export type PreCheckResultSchema = z.infer<typeof resultSchema>;
export type PreCheckDataSchema = z.infer<typeof schema>;
