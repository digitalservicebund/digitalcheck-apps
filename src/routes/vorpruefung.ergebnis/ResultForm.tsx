import Alert from "@/components/Alert";
import Button, { LinkButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer";
import DetailsSummary from "@/components/DetailsSummary";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import InputError from "@/components/InputError";
import RichText from "@/components/RichText";
import Textarea from "@/components/Textarea";
import { preCheckResult } from "@/resources/content/vorpruefung-ergebnis";
import {
  buildEmailBody,
  buildMailtoUri,
} from "@/routes/vorpruefung.ergebnis/buildMailtoUri";
import {
  DriveFileRenameOutline,
  EmailOutlined,
} from "@digitalservicebund/icons";
import { useField } from "@rvf/react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  usePreCheckData,
  useSyncedForm,
} from "../vorpruefung/preCheckDataHook";
import { resultSchema } from "../vorpruefung/preCheckDataSchema";
import { ResultType } from "./PreCheckResult";
import type { ResultContent } from "./getContentForResult";

export default function ResultForm({
  resultContent,
  setVorhabenTitle,
}: Readonly<{
  resultContent: ResultContent;
  setVorhabenTitle: Dispatch<SetStateAction<string>>;
}>) {
  const [showEmailAlert, setShowEmailAlert] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [isMailBodyCopied, setIsMailBodyCopied] = useState<boolean>(false);
  // const [isMailAddressCopied, setIsMailAddressCopied] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { resultData, result } = usePreCheckData();

  const form = useSyncedForm({
    schema: resultSchema,
    onBeforeSubmit: async ({ getValidatedData }) => {
      if (await getValidatedData()) setShowEmailAlert(true);
    },
    defaultValues: {
      result: "" as unknown as ResultType,
      title: "",
      negativeReasoning: "",
    },
    storedData: resultData,
  });

  useEffect(() => {
    const unsubscribeForm = form.subscribe.value((formValues) => {
      const res = resultSchema.safeParse(formValues);
      setIsValid(res.success);
    });
    const unsubscribeTitle = form.subscribe.value("title", setVorhabenTitle);
    const unsubscribeNegativeResoning = form.subscribe.value(
      "negativeReasoning",
      (value) => {
        if (value && value.length > 2000)
          setWarning(preCheckResult.form.reasonLong);
        else setWarning(null);
      },
    );

    return () => {
      unsubscribeForm();
      unsubscribeTitle();
      unsubscribeNegativeResoning();
    };
  }, [form, setVorhabenTitle]);

  const emailPreviewBody = useMemo(() => {
    const currentVorhabenTitle = form.value("title") ?? "";
    const currentNegativeReasoning = form.value("negativeReasoning") ?? "";

    return buildEmailBody(
      resultContent,
      currentNegativeReasoning,
      currentVorhabenTitle,
    );
  }, [resultContent, form]);

  const handleCopyEmailBody = async () => {
    if (navigator.clipboard && emailPreviewBody) {
      await navigator.clipboard.writeText(emailPreviewBody);
      setIsMailBodyCopied(true);
      setTimeout(() => {
        setIsMailBodyCopied(false);
      }, 2000); // Hide Kopiert message after 2 seconds
    }
  };

  // const handleCopyMailAddress = async () => {
  //   let addressesToCopy = preCheckResult.form.emailTemplate.toNkr;
  //   if (result?.interoperability === ResultType.POSITIVE) {
  //     addressesToCopy += `, ${preCheckResult.form.emailTemplate.toDC}`;
  //   }
  //   await navigator.clipboard.writeText(addressesToCopy);
  //   setIsMailAddressCopied(true);
  //   setTimeout(() => setIsMailAddressCopied(false), 2000); // Hide Kopiert message after 2 seconds
  // };

  const resultField = useField(form.scope("result"));

  return (
    <>
      <form {...form.getFormProps()} data-testid="result-form">
        <input {...resultField.getHiddenInputProps()} />
        <div className="kern-stack kern-stack-lg">
          <Heading
            tagName="h2"
            className="kern-heading-medium"
            text={preCheckResult.form.formLegend}
          />

          <div className="flex items-start pb-[40px]">
            <div className="mr-[16px] shrink-0">
              <EmailOutlined className="fill-kern-action-default h-40 w-40" />
            </div>
            <div className="kern-stack kern-stack-md grow">
              <RichText markdown={preCheckResult.form.instructions} />
              <div className="max-w-a11y">
                <Input scope={form.scope("title")} warningInsteadOfError>
                  {preCheckResult.form.vorhabenTitleLabel}
                </Input>
              </div>

              {result?.digital === ResultType.NEGATIVE && (
                <div className="max-w-a11y">
                  <Textarea
                    scope={form.scope("negativeReasoning")}
                    warningInsteadOfError
                  >
                    {preCheckResult.form.reasonLabel}
                  </Textarea>
                  {warning && (
                    <InputError look={"warning"}>{warning}</InputError>
                  )}
                </div>
              )}
              <ButtonContainer>
                {isValid ? (
                  <LinkButton
                    href={buildMailtoUri(
                      result,
                      resultContent,
                      form.value("title"),
                      form.value("negativeReasoning"),
                    )}
                  >
                    {preCheckResult.form.sendEmailButton.text}
                  </LinkButton>
                ) : (
                  <Button id="result-email-button" look="primary" type="submit">
                    {preCheckResult.form.sendEmailButton.text}
                  </Button>
                )}
              </ButtonContainer>
              {showEmailAlert && (
                <div className="mt-16">
                  <Alert
                    title={preCheckResult.form.emailClientHint.title}
                    content={preCheckResult.form.emailClientHint.text}
                    tagName="h3"
                    look="info"
                    setShowAlert={setShowEmailAlert}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="flex items-start">
        <div className="mr-[16px] shrink-0">
          <DriveFileRenameOutline className="fill-kern-action-default h-40 w-40" />
        </div>
        <div className="kern-stack kern-stack-lg grow">
          <RichText markdown={preCheckResult.form.copyIntroText}></RichText>
          <DetailsSummary
            showVerticalLine
            title={preCheckResult.form.previewLabel}
          >
            <div
              data-testid="emailPreview"
              className="whitespace-pre-wrap max-sm:hyphens-auto"
            >
              {emailPreviewBody}
            </div>
          </DetailsSummary>
          <ButtonContainer>
            <Button
              type="button"
              look="tertiary"
              onClick={() => {
                void handleCopyEmailBody();
              }}
            >
              {isMailBodyCopied
                ? preCheckResult.form.copyMailButton.textCopied
                : preCheckResult.form.copyMailButton.text}
            </Button>
          </ButtonContainer>
        </div>
      </div>
    </>
  );
}
