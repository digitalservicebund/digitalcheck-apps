import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import { NumberedList } from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText";
import {
  ControlPointOutlined,
  HelpOutline,
  RemoveCircleOutline,
} from "@digitalservicebund/icons";
import CancelOutlined from "@digitalservicebund/icons/CancelOutlined";
import CheckCircleOutlined from "@digitalservicebund/icons/CheckCircleOutlined";
import WarningAmberOutlined from "@digitalservicebund/icons/WarningAmberOutlined";
import Accordion from "components/Accordion";
import React, { useState } from "react";
import { preCheck } from "resources/content";
import type { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import {
  type PreCheckResult,
  ResultType,
} from "routes/vorpruefung.ergebnis/PreCheckResult";
import { twJoin } from "tailwind-merge";
import resolveResultContent, { type Reason } from "./resolveResultContent";
import ResultForm from "./ResultForm";

const nextSteps = {
  [ResultType.POSITIVE]: preCheck.result.positive.nextSteps,
  [ResultType.NEGATIVE]: preCheck.result.negative.nextSteps,
};

function getIconForReason(reason: Reason) {
  const defaultClasses = "w-28 h-auto shrink-0";
  switch (reason.answer) {
    case "yes":
      return (
        <ControlPointOutlined
          className={twJoin(defaultClasses, "fill-[#005E34]")}
        ></ControlPointOutlined>
      );
    case "no":
      return (
        <RemoveCircleOutline
          className={twJoin(defaultClasses, "fill-[#8E001B]")}
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
      <span>
        {reason.text}
        {reason.hint && <RichText markdown={reason.hint} />}
      </span>
    </li>
  );
}

export default function ResultPage({
  answers,
  result,
}: Readonly<{
  answers: PreCheckAnswers;
  result: PreCheckResult;
}>) {
  const [policyTitle, setPolicyTitle] = useState("");

  const resultContent = resolveResultContent(answers, result);

  function getHeaderIcon() {
    const iconClassName = "w-full h-full";
    switch (result.digital) {
      case ResultType.POSITIVE:
        return <CheckCircleOutlined className={iconClassName} />;
      case ResultType.NEGATIVE:
        return <CancelOutlined className={iconClassName} />;
      case ResultType.UNSURE:
        return <WarningAmberOutlined className={iconClassName} />;
    }
  }

  const resultHint =
    result.digital === ResultType.UNSURE ? preCheck.result.unsure.hint : "";
  return (
    <>
      <Background backgroundColor="blue" className="pt-40 pb-40 print:pb-0">
        <div className="px-16">
          <Container
            className="pt-32 pb-32 rounded-t-lg"
            backgroundColor={
              result.digital === ResultType.UNSURE ? "lightYellow" : "midBlue"
            }
          >
            {policyTitle && (
              <Header
                heading={{
                  tagName: "h2",
                  look: "ds-heading-03-reg",
                  text: `${preCheck.result.print.titlePrefix}${policyTitle}`,
                  className: "hidden print:block pb-24 font-bold",
                }}
              />
            )}
            <div className="flex sm:flex-row flex-col gap-16">
              <div className="flex-none w-36 h-36 flex items-center justify-center">
                {getHeaderIcon()}
              </div>
              <Header
                heading={{
                  tagName: "h1",
                  look: "ds-heading-02-reg",
                  text: resultContent.title,
                  className: "mb-0",
                }}
                {...(resultHint && { content: { markdown: resultHint } })}
              />
            </div>
          </Container>
          <Container className="rounded-b-lg" backgroundColor="white">
            <div className="pb-40 border-solid border-b-2 border-gray-400 last:border-0 last:pb-0 print:border-0 print:pb-0">
              {resultContent.reasoningList
                .filter(({ reasons }) => reasons.length > 0)
                .map(({ intro, reasons }) => (
                  <React.Fragment key={intro}>
                    <RichText className="mt-40 first:mt-0" markdown={intro} />
                    <ul className="ds-stack-16 mt-16">
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
            </div>
            {result.digital !== ResultType.UNSURE && (
              <div className="mt-32 print:hidden">
                <ResultForm
                  result={result}
                  answers={answers}
                  setPolicyTitle={setPolicyTitle}
                />
              </div>
            )}
          </Container>
        </div>
      </Background>
      <Container className="pb-40">
        {result.digital === ResultType.UNSURE && (
          <Box
            heading={{
              text: preCheck.result.unsure.nextStep.title,
            }}
            content={{
              markdown: preCheck.result.unsure.nextStep.text,
            }}
            buttons={[
              {
                id: "result-method-button",
                text: preCheck.result.unsure.nextStep.link.text,
                href: preCheck.result.unsure.nextStep.link.href,
                look: "link",
              },
            ]}
          />
        )}
        {result.digital !== ResultType.UNSURE && nextSteps && (
          <NumberedList
            heading={{
              text: nextSteps[result.digital].title,
              tagName: "h2",
            }}
            items={nextSteps[result.digital].steps}
          />
        )}
      </Container>
      <Container className="print:hidden">
        <Heading
          tagName="h2"
          look="ds-heading-02-reg text-center mb-64 max-sm:mb-56"
          text={preCheck.faq.title}
        />
        <Accordion items={preCheck.faq.items} />
      </Container>
    </>
  );
}
