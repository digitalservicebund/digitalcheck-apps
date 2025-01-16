import { withZod } from "@rvf/zod";
import { preCheck } from "resources/content";
import type { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import { z } from "zod";

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
  const isPositive = !!Object.values(answers).find((a) => a === "yes");
  return withZod(isPositive ? positiveValidation : negativeValidation);
}
