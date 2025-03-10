import {
  CancelOutlined,
  CheckCircleOutlined,
  ControlPointOutlined,
  HelpOutline,
  RemoveCircleOutline,
  WarningAmberOutlined,
} from "@digitalservicebund/icons";
import { validationError } from "@rvf/react-router";
import React, { useState } from "react";
import { data, redirect, useLoaderData, type MetaArgs } from "react-router";
import { twJoin } from "tailwind-merge";

import Accordion from "~/components/Accordion";
import Background from "~/components/Background";
import Box from "~/components/Box";
import Button from "~/components/Button";
import Container from "~/components/Container";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import { NumberedList } from "~/components/List";
import RichText from "~/components/RichText";
import { preCheck } from "~/resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "~/resources/staticRoutes";
import type { PreCheckAnswers } from "~/routes/vorpruefung.$questionId/route";
import buildMailtoRedirectUri from "~/routes/vorpruefung.ergebnis/buildMailtoRedirectUri";
import getContentForResult, {
  type Reason,
} from "~/routes/vorpruefung.ergebnis/getContentForResult";
import {
  getResultForAnswers,
  getResultForRelevantAnswers,
} from "~/routes/vorpruefung.ergebnis/getResultForAnswers";
import ResultForm from "~/routes/vorpruefung.ergebnis/ResultForm";
import {
  getAnswersFromCookie,
  getHeaderFromCookie,
} from "~/utils/cookies.server";
import prependMetaTitle from "~/utils/metaTitle";
import trackCustomEvent from "~/utils/trackCustomEvent.server";
import type { Route } from "./+types/route";
import { PreCheckResult, ResultType } from "./PreCheckResult";
import getResultValidatorForAnswers from "./resultValidation";

const { questions } = preCheck;

const nextSteps = {
  [ResultType.POSITIVE]: preCheck.result.positive.nextSteps,
  [ResultType.NEGATIVE]: preCheck.result.negative.nextSteps,
};

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_RESULT.title, matches);
};

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = await getAnswersFromCookie(request);
  const { answers } = cookie;

  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(ROUTE_PRECHECK.url);
  }

  const result: PreCheckResult = getResultForAnswers(answers);

  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat",
    props: { result: result.digital },
  });
  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat Interoperability",
    props: { result: result.interoperability },
  });

  // Set cookie to store user has viewed result
  cookie.hasViewedResult = true;

  return data(
    {
      result,
      answers,
    },
    await getHeaderFromCookie(cookie),
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { title, negativeReasoning, ...answers } = Object.fromEntries(formData);

  // server side form validation in case the user has JavaScript disabled
  const preCheckAnswers = answers as PreCheckAnswers;
  const validator = getResultValidatorForAnswers(preCheckAnswers);
  const validationResult = await validator.validate({
    title,
    negativeReasoning,
  });
  if (validationResult.error) {
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );
  }

  const result = getResultForAnswers(preCheckAnswers);
  const resultContent = getContentForResult(preCheckAnswers, result);
  return redirect(
    buildMailtoRedirectUri(
      result,
      resultContent,
      formData.get("title") as string,
      formData.get("email") as string,
      formData.get("negativeReasoning") as string,
    ),
  );
}

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

export default function Result() {
  const { result, answers } = useLoaderData<typeof loader>();
  const [policyTitle, setPolicyTitle] = useState("");

  const resultContent = getContentForResult(answers, result);

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
      <Background backgroundColor="blue" className="py-40 print:pb-0">
        <div className="px-16">
          <Container
            className="rounded-t-lg py-32"
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
            <div className="flex flex-col gap-16 sm:flex-row">
              <div className="flex size-36 flex-none items-center justify-center">
                {getHeaderIcon()}
              </div>
              <Header
                heading={{
                  tagName: "h1",
                  look: "ds-heading-03-reg",
                  markdown: resultContent.title,
                  className: "mb-0",
                }}
                {...(resultHint && { content: { markdown: resultHint } })}
              />
            </div>
          </Container>
          <Container className="rounded-b-lg" backgroundColor="white">
            <div className="border-b-2 border-solid border-gray-400 pb-40 last:border-0 last:pb-0 print:border-0 print:pb-0">
              {resultContent.reasoningList
                .filter(({ reasons }) => reasons.length > 0)
                .map(({ intro, reasons }) => (
                  <React.Fragment key={intro}>
                    <RichText markdown={intro} className="mt-40 first:mt-0" />
                    <ul className="ds-stack-16 mt-16 pl-0">
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
              {getResultForRelevantAnswers(answers, true) !==
                ResultType.NEGATIVE && (
                <div className="mt-40">
                  <b>{preCheck.result.interoperability.info.title}</b>
                  <p className="mb-20 mt-8">
                    {preCheck.result.interoperability.info.content}
                  </p>
                  <Button {...preCheck.result.interoperability.info.button} />
                </div>
              )}
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
