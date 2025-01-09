import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Heading from "@digitalcheck/shared/components/Heading";
import Input from "@digitalcheck/shared/components/Input";
import RichText from "@digitalcheck/shared/components/RichText";
import Textarea from "@digitalcheck/shared/components/Textarea";
import { useForm } from "@rvf/remix";
import React, { useState } from "react";
import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import getResultValidatorForAnswers from "routes/vorpruefung.ergebnis/resultValidation";
import { PreCheckResult, ResultType } from "./PreCheckResult.tsx";

export default function ResultForm({
  result,
  answers,
}: Readonly<{
  result: PreCheckResult;
  answers: PreCheckAnswers;
}>) {
  const form = useForm({
    validator: getResultValidatorForAnswers(answers),
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
    <>
      <form {...form.getFormProps()}>
        <fieldset className="ds-stack-32">
          <legend>
            <Heading tagName="h2" text={preCheck.result.form.formLegend} />
          </legend>
          <RichText markdown={preCheck.result.form.instructions} />
          {Object.keys(answers).map((answer) => (
            <input
              key={answer}
              name={answer}
              value={answers[answer]}
              type="hidden"
            />
          ))}
          <Input
            name="email"
            type={"email"}
            label={preCheck.result.form.emailLabel}
            error={form.error("email")}
          />
          <Input
            name="title"
            label={preCheck.result.form.policyTitleLabel}
            error={form.error("title")}
          />
          {result.digital === ResultType.NEGATIVE && (
            <Textarea
              name="negativeReasoning"
              label={preCheck.result.form.reasonLabel}
              error={form.error("negativeReasoning")}
              warning={warning}
              onChange={handleNegativeReasoningChange}
            />
          )}
          <ButtonContainer
            buttons={[
              {
                id: "result-email-button",
                name: "_action",
                value: "email",
                text: preCheck.result.form.sendEmailButton.text,
                look: "primary",
                className: "plausible-event-name=Quicksend+Click",
              },
            ]}
          />
        </fieldset>
      </form>
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
    </>
  );
}
