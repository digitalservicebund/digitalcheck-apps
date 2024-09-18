import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Heading from "@digitalcheck/shared/components/Heading";
import Input from "@digitalcheck/shared/components/Input";
import RichText from "@digitalcheck/shared/components/RichText";
import Textarea from "@digitalcheck/shared/components/Textarea";
import { useFetcher } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React, { useEffect, useState } from "react";
import { preCheck } from "resources/content";
import { ROUTE_RESULT_PDF } from "resources/staticRoutes";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import { useFeatureFlag } from "utils/featureFlags";
import { z } from "zod";
import { type action as TUniqAction } from "../uniq.($encrypted).($iv)";

export default function ResultForm({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
  const [downloadIsDisabled, setDownloadIsDisabled] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const fetcher = useFetcher<typeof TUniqAction>();
  const [uniqueUrl, setUniqueUrl] = useState("");
  const quickSendNkrFlag = useFeatureFlag("digitalcheck.quicksend-nkr");

  const isPositive = !!Object.values(answers).find((a) => a === "yes");

  const negativeValidation = z.object({
    title: z
      .string()
      .min(1, { message: preCheck.result.form.policyTitleRequired })
      .max(500, { message: preCheck.result.form.policyTitleTooLong }),
    negativeReasoning: z
      .string()
      .min(1, { message: preCheck.result.form.reasonRequired })
      .max(5000, { message: preCheck.result.form.reasonTooLong }),
  });

  const positiveValidation = negativeValidation.omit({
    negativeReasoning: true,
  });

  const validator = withZod(
    isPositive ? positiveValidation : negativeValidation,
  );

  const form = useForm({
    validator,
    method: "post",
    action: ROUTE_RESULT_PDF.url,
    reloadDocument: true,
  });

  const subject = `${preCheck.result.form.emailTemplate.subject}: „${form.value("title")}“`;
  const body = `${preCheck.result.form.emailTemplate.bodyBefore}\n\n${uniqueUrl}\n\n${preCheck.result.form.emailTemplate.bodyAfter}`;
  const mailTo = encodeURI(
    `mailto:${preCheck.result.form.emailTemplate.to}?subject=${subject}&body=${body}`,
  );

  useEffect(() => {
    if (form.formState.isValid && form.formState.isSubmitting) {
      setDownloadIsDisabled(true);

      const timeout = setTimeout(() => {
        form.resetForm();
        setDownloadIsDisabled(false);
      }, 2000);

      return () => {
        setDownloadIsDisabled(false);
        clearTimeout(timeout);
      };
    }
  }, [form]);

  useEffect(() => {
    if (fetcher.data) {
      const { url } = fetcher.data;
      setUniqueUrl(url);
    }
  }, [fetcher.data]);

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
      <form
        {...form.getFormProps()}
        onChange={(event) => {
          fetcher.submit(event.currentTarget, {
            action: "/uniq",
            method: "POST",
          });
        }}
      >
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
                      text: preCheck.result.form.sendEmailButton.text,
                      href: uniqueUrl ? mailTo : "",
                      type: "submit",
                      look: "primary",
                      disabled: !form.formState.isValid,
                      className: "plausible-event-name=Quicksend+Click",
                    },
                    {
                      id: "result-download-button",
                      text: downloadIsDisabled
                        ? preCheck.result.form.downloadStarted
                        : preCheck.result.form.downloadPdfButton.text,
                      type: "submit",
                      look: "ghost",
                      disabled: downloadIsDisabled,
                    },
                  ]
                : [
                    {
                      id: "result-download-button",
                      text: downloadIsDisabled
                        ? preCheck.result.form.downloadStarted
                        : "Vorprüfung herunterladen",
                      type: "submit",
                      look: "primary",
                      disabled: downloadIsDisabled,
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
