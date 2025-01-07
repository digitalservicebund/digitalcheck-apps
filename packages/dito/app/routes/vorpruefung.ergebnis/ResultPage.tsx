import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { NumberedList } from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import {
  ControlPointOutlined,
  HelpOutline,
  RemoveCircleOutline,
} from "@digitalservicebund/icons";
import classNames from "classnames";
import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import Accordion from "../../components/Accordion.tsx";
import ResultForm from "./ResultForm.tsx";
import ResultHeader from "./ResultHeader";
import { ResultType, TResult } from "./TResult.tsx";
import resolveResultContent, { Reason } from "./resolveResultContent.ts";

const nextSteps = {
  [ResultType.POSITIVE]: preCheck.result.positive.nextSteps,
  [ResultType.NEGATIVE]: preCheck.result.negative.nextSteps,
};

export default function ResultPage({
  answers,
  result,
}: Readonly<{
  answers: PreCheckAnswers;
  result: TResult;
}>) {
  const resultContent = resolveResultContent(answers, result);

  function getIconForReason(reason: Reason) {
    const defaultClasses = "w-28 h-auto";
    switch (reason.answer) {
      case "yes":
        return (
          <ControlPointOutlined
            className={classNames(defaultClasses, "fill-green-900")}
          ></ControlPointOutlined>
        );
      case "no":
        return (
          <RemoveCircleOutline
            className={classNames(defaultClasses, "fill-red-900")}
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
          <span>
            {reason.text}
            {reason.hint && <RichText markdown={reason.hint} />}
          </span>
        </span>
      </li>
    );
  }

  return (
    <>
      <ResultHeader
        resultType={result.digital}
        resultHeading={resultContent.title}
        resultHint={
          result.digital === ResultType.UNSURE
            ? preCheck.result.unsure.hint
            : ""
        }
        resultBackgroundColor={
          result.digital === ResultType.UNSURE ? "lightYellow" : "midBlue"
        }
      >
        <Container backgroundColor="white" additionalClassNames="rounded-b-lg">
          <div className="pb-40 border-solid border-0 border-b-2 border-gray-400 last:border-0 last:pb-0">
            {resultContent.reasoningList.map(({ intro, reasons }) => (
              <>
                {reasons.length !== 0 && (
                  <>
                    <RichText className="mt-40 first:mt-0" markdown={intro} />
                    <ul className="ds-stack-16 mt-16">
                      {reasons
                        .sort((reason) => (reason.answer === "yes" ? -1 : 1))
                        .map((reason) => getReasonListItem(reason))}
                    </ul>
                  </>
                )}
              </>
            ))}
          </div>
          {result.digital !== ResultType.UNSURE && (
            <div className="mt-32">
              <ResultForm result={result} answers={answers} />
            </div>
          )}
        </Container>
      </ResultHeader>
      <Container paddingBottom="40">
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
                look: "ghost",
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
      <Container>
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
