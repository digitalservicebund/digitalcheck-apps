import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { z } from "zod";

import Button from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import Input from "@digitalcheck/shared/components/Input";
import List from "@digitalcheck/shared/components/List";
import Textarea from "@digitalcheck/shared/components/Textarea";
import Download from "@digitalservicebund/icons/Download.js";

import { assessment, preCheck } from "resources/content";
import { PATH_ASSESSMENT_PDF } from "resources/staticRoutes";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { title, reasoningIntro, nextSteps } = preCheck.result.negative;

const validator = withZod(
  z.object({
    title: z
      .string()
      .min(1, { message: assessment.form.policyTitleRequired })
      .max(500, { message: assessment.form.policyTitleTooLong }),
    negativeReasoning: z
      .string()
      .min(1, { message: assessment.form.reasonRequired })
      .max(5000, { message: assessment.form.reasonTooLong }),
  }),
);

export default function ResultNegative({
  negativeQuestions,
}: Readonly<{
  negativeQuestions: string[];
}>) {
  const form = useForm({
    validator,
    method: "post",
    action: PATH_ASSESSMENT_PDF,
    reloadDocument: true,
  });
  const reasonsText = getReasoningText(
    negativeQuestions,
    reasoningIntro,
    "negativeResult",
  );

  return (
    <>
      <ResultHeader
        resultType="negative"
        resultHeading={title}
        reasonsText={reasonsText}
        resultBackgroundColor="midBlue"
      >
        <form {...form.getFormProps()} className="mt-32">
          <fieldset className="ds-stack-32">
            <legend>
              <Heading
                tagName="h3"
                text={assessment.form.formLegend}
                className="mb-16"
              />
            </legend>
            <Textarea
              name="negativeReasoning"
              label={assessment.form.reasonLabel}
              error={form.error("negativeReasoning")}
            />
            <Input
              name="title"
              label={assessment.form.policyTitleLabel}
              error={form.error("title")}
            />
            <Button
              text={assessment.form.downloadPdfButton.text}
              look="primary"
              size="large"
              iconLeft={<Download />}
              type="submit"
              className="self-start"
            />
          </fieldset>
        </form>
      </ResultHeader>
      <Container>
        <List
          heading={{
            text: nextSteps.title,
            tagName: "h2",
          }}
          items={nextSteps.steps}
          isNumeric
        />
      </Container>
    </>
  );
}
