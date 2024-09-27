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
import { PRE_CHECK_PDF, ROUTE_RESULT_PDF } from "resources/staticRoutes";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import { useFeatureFlag } from "utils/featureFlags";
import { z } from "zod";

export default function ResultForm({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
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

  const form = useForm({ validator });

  const validateFormAndGetData = async () => {
    await form.validate();
    if (!form.transient.formState.isValid) {
      return null;
    }
    const formData = new FormData();
    // we need to use transient.value here because the form state is not yet updated
    formData.append("title", form.transient.value("title") as string);
    formData.append(
      "negativeReasoning",
      form.transient.value("negativeReasoning") as string,
    );
    Object.entries(answers).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  const [downloadDisabled, setDownloadDisabled] = useState(false);
  const downloadDocument = async () => {
    const formData = await validateFormAndGetData();
    if (!formData) {
      return;
    }

    setDownloadDisabled(true);
    const response = await fetch(ROUTE_RESULT_PDF.url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      alert(`Error processing PDF: ${response.statusText}`);
      setDownloadDisabled(false);
      return;
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = PRE_CHECK_PDF; // set filename
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
    setDownloadDisabled(false);
  };

  const openMailTo = async () => {
    const formData = await validateFormAndGetData();
    if (!formData) {
      return;
    }
    const uniqueResponse = await fetch("/uniq", {
      method: "POST",
      body: formData,
    });
    const emailTemplate = preCheck.result.form.emailTemplate;
    const uniqueUrl = (await uniqueResponse.json()).url;
    const subject = `${emailTemplate.subject}: „${form.value("title")}“`;
    const body = `${emailTemplate.bodyBefore}\n\n${uniqueUrl}\n\n${emailTemplate.bodyAfter}`;
    const mailToLink = encodeURI(
      `mailto:${emailTemplate.to}?subject=${subject}&body=${body}`,
    );
    window.location.href = mailToLink;
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
                      look: "primary",
                      className: "plausible-event-name=Quicksend+Click",
                      onClick: () => void openMailTo(),
                    },
                    {
                      id: "result-download-button",
                      text: downloadDisabled
                        ? preCheck.result.form.downloadStarted
                        : preCheck.result.form.downloadPdfButton.text,
                      look: "ghost",
                      disabled: downloadDisabled,
                      onClick: () => void downloadDocument(),
                    },
                  ]
                : [
                    {
                      id: "result-download-button",
                      text: downloadDisabled
                        ? preCheck.result.form.downloadStarted
                        : preCheck.result.form.downloadPdfButton.text,
                      look: "primary",
                      onClick: () => void downloadDocument(),
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
