import { useForm } from "@rvf/react-router";
import React, { Dispatch, SetStateAction, useState } from "react";
import Alert from "~/components/Alert";
import ButtonContainer from "~/components/ButtonContainer";
import DetailsSummary from "~/components/DetailsSummary";
import Heading from "~/components/Heading";
import Input from "~/components/Input";
import RichText from "~/components/RichText";
import Textarea from "~/components/Textarea";
import { preCheck } from "~/resources/content";
import { features } from "~/resources/features";
import { PreCheckAnswers } from "~/routes/vorpruefung.$questionId/route";
import getResultValidatorForAnswers from "~/routes/vorpruefung.ergebnis/resultValidation";
import { useFeatureFlag } from "~/utils/featureFlags";
import { PreCheckResult, ResultType } from "./PreCheckResult";

export default function ResultForm({
  result,
  answers,
  setPolicyTitle,
}: Readonly<{
  result: PreCheckResult;
  answers: PreCheckAnswers;
  setPolicyTitle: Dispatch<SetStateAction<string>>;
}>) {
  const showSaveToPdf = useFeatureFlag(features.showSaveToPdfOption);

  const [showEmailAlert, setShowEmailAlert] = useState<boolean>(false);
  const form = useForm({
    validator: getResultValidatorForAnswers(answers),
    method: "post",
    onBeforeSubmit: async ({ getValidatedData }) => {
      if (await getValidatedData()) setShowEmailAlert(true);
    },
  });

  const handlePolicyTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPolicyTitle(event.target.value);
  };

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
      <form {...form.getFormProps()} data-testid="result-form">
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
            onChange={handlePolicyTitleChange}
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
            buttons={
              showSaveToPdf
                ? [
                    {
                      id: "result-email-button",
                      text: preCheck.result.form.sendEmailButton.text,
                      look: "primary",
                      className: "plausible-event-name=Quicksend+Click",
                    },
                    {
                      id: "result-print-button",
                      text: preCheck.result.form.downloadPdfButton.text,
                      look: "ghost",
                      type: "button",
                      className: "plausible-event-name=Quicksend+Click",
                      onClick: () => {
                        if (window) window.print();
                      },
                    },
                  ]
                : [
                    {
                      id: "result-email-button",
                      text: preCheck.result.form.sendEmailButton.text,
                      look: "primary",
                      className: "plausible-event-name=Quicksend+Click",
                    },
                  ]
            }
          />
        </fieldset>
      </form>
      {showEmailAlert && (
        <div className="mt-16">
          <Alert
            title={preCheck.result.form.emailClientHint.title}
            content={preCheck.result.form.emailClientHint.text}
            tagName="h3"
            look="info"
            setShowAlert={setShowEmailAlert}
          />
        </div>
      )}
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
