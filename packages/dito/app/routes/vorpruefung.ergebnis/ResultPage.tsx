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
import {
  PreCheckAnswers,
  TQuestion,
} from "routes/vorpruefung.$questionId/route";
import Accordion from "../../components/Accordion.tsx";
import ResultForm from "./ResultForm.tsx";
import ResultHeader from "./ResultHeader";
import { ResultType, TResult } from "./TResult.tsx";

const { nextSteps } = preCheck.result.positive;
const { questions } = preCheck;

type QuestionAndAnswer = {
  question: TQuestion;
  answer: string;
};

function resolveTitleInteroperability(result: TResult) {
  switch (result.interoperability) {
    case ResultType.POSITIVE:
      return preCheck.result.interoperability.positive.title;
    case ResultType.NEGATIVE:
      return preCheck.result.interoperability.negative.title;
    case ResultType.UNSURE:
      return preCheck.result.interoperability.unsure.title;
  }
}

function resolveTitleDigital(result: TResult) {
  switch (result.digital) {
    case ResultType.POSITIVE:
      return preCheck.result.positive.title;
    case ResultType.NEGATIVE:
      return preCheck.result.negative.title;
    case ResultType.UNSURE:
      return preCheck.result.unsure.title;
  }
}

function resolveTitle(result: TResult) {
  return resolveTitleDigital(result) + resolveTitleInteroperability(result);
}

function matchQuestionsAndAnswers(answers: PreCheckAnswers) {
  return Object.keys(answers).map((key) => {
    const question = questions.find((q) => q.id === key);
    if (!question) {
      throw new Error(`No matching question found for key: ${key}`);
    }
    return { question, answer: answers[key] };
  });
}

export default function ResultPage({
  answers,
  result,
}: Readonly<{
  answers: PreCheckAnswers;
  result: TResult;
}>) {
  const questionsAndAnswers = matchQuestionsAndAnswers(answers);

  const questionsForDigitalAndSure = questionsAndAnswers.filter(
    (tuple) => !tuple.question.interoperability && tuple.answer !== "unsure",
  );
  const questionsForDigitalAndUnsure = questionsAndAnswers.filter(
    (tuple) => !tuple.question.interoperability && tuple.answer === "unsure",
  );
  const questionsForInteroperabilitySure = questionsAndAnswers.filter(
    (tuple) => tuple.question.interoperability && tuple.answer !== "unsure",
  );
  const questionsForInteroperabilityUnsure = questionsAndAnswers.filter(
    (tuple) => tuple.question.interoperability && tuple.answer === "unsure",
  );

  function getReasonListItem(data: {
    tuple: QuestionAndAnswer;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    additionalClassName?: string;
    resultType: "positiveResult" | "negativeResult";
  }) {
    const classes = classNames("w-28 h-auto", data.additionalClassName);
    return (
      <>
        <data.icon className={classes}></data.icon>
        <span>{data.tuple.question?.[data.resultType]}</span>
      </>
    );
  }

  function getReason(tuple: QuestionAndAnswer) {
    switch (tuple.answer) {
      case "yes":
        return getReasonListItem({
          tuple,
          icon: ControlPointOutlined,
          additionalClassName: "fill-green-900",
          resultType: "positiveResult",
        });
      case "no":
        return getReasonListItem({
          tuple,
          icon: RemoveCircleOutline,
          additionalClassName: "fill-red-900",
          resultType: "negativeResult",
        });
      case "unsure":
        return getReasonListItem({
          tuple,
          icon: HelpOutline,
          resultType: "positiveResult",
        });
    }
  }

  function getReasons(filteredQuestionsAndAnswers: QuestionAndAnswer[]) {
    return filteredQuestionsAndAnswers
      .sort((t1) => (t1.answer === "yes" ? -1 : 1))
      .map((tuple) => (
        <li key={tuple.question.id} className="flex gap-12">
          {getReason(tuple)}
        </li>
      ));
  }

  function getReasonsList(questions: QuestionAndAnswer[], intro: string) {
    return (
      <>
        {questions.length !== 0 && (
          <>
            <RichText className="mt-40" markdown={intro} />
            <ul className="ds-stack-16 mt-16">{getReasons(questions)}</ul>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <ResultHeader
        resultType={result.digital}
        resultHeading={resolveTitle(result)}
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
            {getReasonsList(
              questionsForDigitalAndSure,
              preCheck.result.reasoningIntro.digital.sure,
            )}
            {getReasonsList(
              questionsForDigitalAndUnsure,
              preCheck.result.reasoningIntro.digital.unsure,
            )}
            {getReasonsList(
              questionsForInteroperabilitySure,
              preCheck.result.reasoningIntro.interoperability.sure,
            )}
            {getReasonsList(
              questionsForInteroperabilityUnsure,
              preCheck.result.reasoningIntro.interoperability.unsure,
            )}
          </div>
          {result.digital !== ResultType.UNSURE && (
            <div className="mt-32">
              <ResultForm answers={answers} />
            </div>
          )}
        </Container>
      </ResultHeader>
      <Container paddingBottom="40">
        {result.digital === ResultType.UNSURE ? (
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
        ) : (
          <NumberedList
            heading={{
              text: nextSteps.title,
              tagName: "h2",
            }}
            items={nextSteps.steps}
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
