import {
  CancelOutlined,
  CheckCircleOutlined,
  ControlPointOutlined,
  HelpOutline,
  RemoveCircleOutline,
  WarningAmberOutlined,
} from "@digitalservicebund/icons";
import React, { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

import Container from "@/components/Container";
import DetailsSummary from "@/components/DetailsSummary";
import Heading from "@/components/Heading";
import InfoBox from "@/components/InfoBox";
import InfoTooltip from "@/components/InfoTooltip";
import InlineNotice from "@/components/InlineNotice";
import NumberedList from "@/components/NumberedList";
import RichText from "@/components/RichText";
import { vorpruefung } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import { preCheckResult } from "@/resources/content/vorpruefung-ergebnis";
import type { Reason } from "@/routes/vorpruefung.ergebnis/getContentForResult";
import getContentForResult from "@/routes/vorpruefung.ergebnis/getContentForResult";
import ResultForm from "@/routes/vorpruefung.ergebnis/ResultForm";
import { marked } from "marked";
import { ResultType } from "./PreCheckResult";

import { PreCheckFAQ } from "@/components/content/PreCheckFAQ.tsx";
import type { Step } from "@/utils/contentTypes.ts";
import { usePreCheckData } from "../vorpruefung/preCheckDataHook";

const nextSteps = {
  [ResultType.POSITIVE as string]: preCheckResult.positive.nextSteps,
  [ResultType.NEGATIVE as string]: preCheckResult.negative.nextSteps,
} satisfies { [key: string]: { steps: Step[] } };

function getIconForReason(reason: Reason) {
  const defaultClasses = "w-28 h-auto shrink-0";
  switch (reason.answer) {
    case "yes":
      return (
        <ControlPointOutlined
          className={twJoin(defaultClasses, "fill-kern-feedback-success")}
        ></ControlPointOutlined>
      );
    case "no":
      return (
        <RemoveCircleOutline
          className={twJoin(defaultClasses, "fill-kern-feedback-danger")}
        ></RemoveCircleOutline>
      );
    case "unsure":
      return <HelpOutline className={defaultClasses}></HelpOutline>;
  }
}

function getReasonListItem(reason: Reason) {
  return (
    <li key={reason.text} className="flex items-start gap-12">
      {getIconForReason(reason)}
      <div className="max-sm:hyphens-auto">
        {reason.text}
        {reason.tooltip && <InfoTooltip>{reason.tooltip}</InfoTooltip>}
        {reason.hint && <RichText markdown={reason.hint} />}
      </div>
    </li>
  );
}

/**
 * A title element for printouts.
 */
function PrintTitle({ title }: Readonly<{ title: string }>) {
  return (
    <Heading
      tagName="h2"
      look="kern-heading-medium"
      className="hidden pb-24 font-bold print:block"
    >
      {preCheckResult.print.titlePrefix}
      {title}
    </Heading>
  );
}

export default function Result() {
  const [vorhabenTitle, setVorhabenTitle] = useState("");
  const { answers, firstUnansweredQuestionIndex, result } = usePreCheckData();

  const resultContent = getContentForResult(answers, result);

  function getHeaderIcon() {
    const iconClassName = "w-full h-full";
    switch (result?.digital) {
      case ResultType.POSITIVE:
        return <CheckCircleOutlined className={iconClassName} />;
      case ResultType.NEGATIVE:
        return <CancelOutlined className={iconClassName} />;
      case ResultType.UNSURE:
        return <WarningAmberOutlined className={iconClassName} />;
    }
  }

  useEffect(() => {
    if (
      firstUnansweredQuestionIndex !== null &&
      firstUnansweredQuestionIndex < preCheck.questions.length - 1
    ) {
      globalThis.location.href = vorpruefung.path;
    }
  }, [firstUnansweredQuestionIndex]);

  const resultHint =
    result?.digital === ResultType.UNSURE ? preCheckResult.unsure.hint : "";
  return (
    <main>
      <div className="bg-kern-darkblue-025 py-40 print:pb-0">
        <div className="space-y-40 px-16">
          <div>
            <Container
              className={twJoin(
                "rounded-t-lg py-32",
                result?.digital === ResultType.UNSURE
                  ? "bg-kern-feedback-warning-background"
                  : "bg-kern-darkblue-100",
              )}
            >
              {vorhabenTitle && <PrintTitle title={vorhabenTitle} />}
              <div className="flex flex-col gap-16 sm:flex-row">
                <div className="mt-18 flex size-36 flex-none items-center justify-center">
                  {getHeaderIcon()}
                </div>
                <div>
                  <Heading
                    tagName="h1"
                    look="kern-heading-large"
                    className="mb-0"
                    text={marked.parseInline(resultContent.title) as string}
                  />
                  {resultHint && (
                    <RichText markdown={resultHint} className="mt-16" />
                  )}
                </div>
              </div>
            </Container>
            <Container className="space-y-40 rounded-b-lg bg-white">
              {resultContent.infoboxContent && (
                <InfoBox
                  heading={{
                    text: resultContent.infoboxContent.title,
                    tagName: "h2",
                    look: "kern-heading-medium",
                  }}
                >
                  <RichText markdown={resultContent.infoboxContent.text} />
                </InfoBox>
              )}
              {resultContent.inlineNoticeContent && (
                <InlineNotice
                  className="[&_p]:mt-16"
                  look="warning"
                  heading={resultContent.inlineNoticeContent.title}
                >
                  <RichText markdown={resultContent.inlineNoticeContent.text} />
                </InlineNotice>
              )}
              <div className="border-kern-decorative-border border-b-2 border-solid pb-40 last:border-0 last:pb-0 print:border-0 print:pb-0">
                <DetailsSummary
                  data-testid="result-details"
                  title={preCheckResult.detailsTitle}
                >
                  {resultContent.reasoningList
                    .filter(({ reasons }) => reasons.length > 0)
                    .map(({ intro, reasons }) => (
                      <React.Fragment key={intro}>
                        <RichText markdown={intro} className="first:mt-16" />
                        <ul className="kern-stack kern-stack-md mt-16 mb-40 pl-0">
                          {reasons
                            .toSorted((a, b) => {
                              if (a.answer === b.answer) {
                                return 0; // Keep the original order
                              }
                              return a.answer === "yes" ? -1 : 1; // "yes" comes before "no"
                            })
                            .map((reason) => getReasonListItem(reason))}
                        </ul>
                      </React.Fragment>
                    ))}

                  {result?.euBezug !== ResultType.NEGATIVE && (
                    <div className="mt-40">
                      <b>{preCheckResult.interoperability.info.title}</b>
                      <RichText
                        className="mt-8 mb-20"
                        markdown={preCheckResult.interoperability.info.content}
                      />
                    </div>
                  )}
                </DetailsSummary>
              </div>
            </Container>
          </div>
          {result?.digital !== ResultType.UNSURE && (
            <>
              <Container className="rounded-lg bg-white print:hidden">
                <ResultForm
                  resultContent={resultContent}
                  setVorhabenTitle={setVorhabenTitle}
                />
              </Container>
              <Container className="rounded-lg bg-white print:hidden">
                <InfoBox
                  heading={{
                    text: preCheckResult.form.outro.title,
                    tagName: "h3",
                  }}
                >
                  <RichText markdown={preCheckResult.form.outro.text} />
                </InfoBox>
                <div className="kern-stack kern-stack-md mt-40">
                  <Heading
                    tagName="h3"

                    text={preCheckResult.form.faqs.title}
                  />
                  {preCheckResult.form.faqs.details.map((detail) => (
                    <DetailsSummary key={detail.label} title={detail.label}>
                      <RichText markdown={detail.text} />
                    </DetailsSummary>
                  ))}
                </div>
              </Container>
            </>
          )}
        </div>
      </div>
      <Container className="my-80 space-y-40 py-0">
        {result?.digital === ResultType.UNSURE && (
          <InfoBox
            heading={{
              text: preCheckResult.unsure.nextStep.title,
              tagName: "h2",
            }}
          >
            <RichText markdown={preCheckResult.unsure.nextStep.text} />
            <InfoBox.LinkList
              links={[
                {
                  id: "result-method-button",
                  text: preCheckResult.unsure.nextStep.link.text,
                  to: preCheckResult.unsure.nextStep.link.to,
                  look: "link",
                },
              ]}
            />
          </InfoBox>
        )}
        {result && result.digital !== ResultType.UNSURE && nextSteps && (
          <>
            <Heading tagName="h2">{nextSteps[result.digital].title}</Heading>
            <NumberedList>
              {(nextSteps[result.digital].steps as Step[]).map((item) => (
                <NumberedList.Item
                  className="space-y-16"
                  key={item.headline.text}
                  disabled={item.isDisabled}
                >
                  <p className="kern-body kern-body--large">
                    {item.headline.text}
                  </p>
                  {"content" in item && (
                    <RichText markdown={item.content as string} />
                  )}
                  {item.link && <a href={item.link.to}>{item.link.text}</a>}
                </NumberedList.Item>
              ))}
            </NumberedList>
          </>
        )}
      </Container>
      <Container className="my-80 py-0 print:hidden">
        <Heading
          tagName="h2"
          className="mb-64 max-sm:mb-56"
          text={preCheck.faq.title}
        />
        <PreCheckFAQ />
      </Container>
    </main>
  );
}
