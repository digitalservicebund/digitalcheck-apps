import { withZod } from "@rvf/zod";
import { z } from "zod";
import { preCheck } from "~/resources/content";
import type { PreCheckAnswers } from "~/routes/vorpruefung.$questionId/route";

const positiveValidation = z.object({
  title: z
    .string()
    .min(1, { message: preCheck.result.form.policyTitleRequired })
    .max(100, { message: preCheck.result.form.policyTitleTooLong }),
});

const negativeValidation = positiveValidation.extend({
  negativeReasoning: z
    .string()
    .min(1, { message: preCheck.result.form.reasonRequired })
    .max(500, { message: preCheck.result.form.reasonTooLong }),
});

export default function getResultValidatorForAnswers(answers: PreCheckAnswers) {
  const ignoredQuestionIds = ["eu-bezug"];
  const isPositive = Object.entries(answers).some(
    ([key, value]) => value === "yes" && !ignoredQuestionIds.includes(key),
  );
  return withZod(isPositive ? positiveValidation : negativeValidation);
}
