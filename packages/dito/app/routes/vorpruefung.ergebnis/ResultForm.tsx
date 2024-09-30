import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Heading from "@digitalcheck/shared/components/Heading";
import Input from "@digitalcheck/shared/components/Input";
import RichText from "@digitalcheck/shared/components/RichText";
import Textarea from "@digitalcheck/shared/components/Textarea";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React, { useState } from "react";
import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import { useFeatureFlag } from "utils/featureFlags";
import { z } from "zod";

const positiveValidation = z.object({
  title: z
    .string()
    .min(1, { message: preCheck.result.form.policyTitleRequired })
    .max(500, { message: preCheck.result.form.policyTitleTooLong }),
});

const negativeValidation = positiveValidation.extend({
  negativeReasoning: z
    .string()
    .min(1, { message: preCheck.result.form.reasonRequired })
    .max(5000, { message: preCheck.result.form.reasonTooLong }),
});

export default function ResultForm({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
  const quickSendNkrFlag = useFeatureFlag("digitalcheck.quicksend-nkr");

  const isPositive = !!Object.values(answers).find((a) => a === "yes");

  const form = useForm({
    validator: withZod(isPositive ? positiveValidation : negativeValidation),
    method: "post",
  });

  const [warning, setWarning] = useState<string | null>(null);
  const handleNegativeReasoningChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    if (value.length > 2000) {
      setWarning(preCheck.result.form.reasonLong);
    } else {
      setWarning(null);
    }
  };

  return (
    <Container
      backgroundColor="white"
      additionalClassNames="rounded-lg"
      overhangingBackground
    >
      <form {...form.getFormProps()}>
        <fieldset className="ds-stack-32">
          <legend>
            {quickSendNkrFlag ? (
              <Heading tagName="h2" text={preCheck.result.form.formLegend} />
            ) : (
              <Heading
                tagName="h2"
                text="Vorprüfung ergänzen und herunterladen"
              />
            )}
          </legend>
          {quickSendNkrFlag && (
            <RichText
              markdown={
                isPositive
                  ? preCheck.result.form.instructionsPositive
                  : preCheck.result.form.instructionsNegative
              }
            />
          )}
          {Object.keys(answers).map((answer) => (
            <input
              key={answer}
              name={answer}
              value={answers[answer]}
              type="hidden"
            />
          ))}
          <Input
            name="title"
            label={preCheck.result.form.policyTitleLabel}
            error={form.error("title")}
          />
          {!isPositive && (
            <Textarea
              name="negativeReasoning"
              label={preCheck.result.form.reasonLabel}
              error={form.error("negativeReasoning")}
              warning={warning}
              onChange={handleNegativeReasoningChange}
            />
          )}
          <ButtonContainer
            buttons={
              quickSendNkrFlag
                ? [
                    {
                      id: "result-email-button",
                      name: "action",
                      value: "email",
                      text: preCheck.result.form.sendEmailButton.text,
                      look: "primary",
                      className: "plausible-event-name=Quicksend+Click",
                    },
                    {
                      id: "result-download-button",
                      name: "action",
                      value: "download",
                      text: preCheck.result.form.downloadPdfButton.text,
                      look: "ghost",
                    },
                  ]
                : [
                    {
                      id: "result-download-button",
                      name: "action",
                      value: "download",
                      text: preCheck.result.form.downloadPdfButton.text,
                      look: "primary",
                    },
                  ]
            }
          />
        </fieldset>
      </form>
      {quickSendNkrFlag && (
        <div className="ds-stack-16 mt-40">
          <Heading
            tagName="h3"
            className="ds-label-section"
            text={preCheck.result.form.faqs.title}
          />
          {preCheck.result.form.faqs.details.map((detail) => (
            <DetailsSummary
              key={detail.label}
              title={detail.label}
              content={detail.text}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
