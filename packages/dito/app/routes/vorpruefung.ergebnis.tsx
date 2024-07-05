import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Input from "@digitalcheck/shared/components/Input";
import List from "@digitalcheck/shared/components/List";
import Textarea from "@digitalcheck/shared/components/Textarea";
import Download from "@digitalservicebund/icons/Download";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, useLoaderData } from "@remix-run/react";
import { FormEventHandler } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { assessment, preCheck, siteMeta } from "resources/content";
import { PATH_PRECHECK } from "resources/staticRoutes";
import { getAnswersFromCookie } from "utils/cookies.server";
import type { Answers, Option } from "./vorpruefung.$questionId/route";

const { result, questions } = preCheck;

export const meta: MetaFunction = () => {
  return [{ title: `${result.title} — ${siteMeta.title}` }];
};

const getQuestionIDsOfOption = (answers: Answers, option: Option["value"]) =>
  Object.keys(answers).filter((key) => answers[key] === option);

export async function loader({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(PATH_PRECHECK);
  }
  const positiveQuestions = getQuestionIDsOfOption(answers, "yes");
  const unsureQuestions = getQuestionIDsOfOption(answers, "unsure");
  const negativeQuestions = getQuestionIDsOfOption(answers, "no");
  return json({ positiveQuestions, unsureQuestions, negativeQuestions });
}

export default function Result() {
  const { positiveQuestions, unsureQuestions, negativeQuestions } =
    useLoaderData<typeof loader>();

  const { register, formState, trigger } = useForm<FieldValues>();

  const heading = (
    <Heading
      tagName="h1"
      text={result.title}
      look="ds-heading-02-reg"
      className="mb-32"
    />
  );
  const getReasoningNotice = (title: string, content: string) => (
    <InlineNotice
      look="info"
      title={title}
      tagName="h2"
      content={content}
      showIcon={false}
    />
  );
  const getReasoningText = (answer: string, questionIds: string[]) => {
    const reasons = questionIds
      .map((qId) => `- ${questions.find((q) => q.id === qId)?.result}`)
      .join("\n");
    return `**Folgende Fragen haben Sie mit "${answer}" beantwortet:**\n\n${result.reasonIntro}\n${reasons}`;
  };

  // We have at least one positive answer
  if (positiveQuestions.length > 0) {
    const reasonsText = getReasoningText("Ja", positiveQuestions);
    return (
      <>
        <Container>
          {heading}
          {getReasoningNotice(result.positive, reasonsText)}
          <div className="mt-32">
            <Button {...result.receivePdfButton} look="tertiary" />
          </div>
        </Container>
        <Container>
          <List
            heading={{
              text: result.nextStepsPositive.title,
              tagName: "h2",
            }}
            items={result.nextStepsPositive.steps}
            isNumeric
          />
        </Container>
      </>
    );
  }

  // Some answers are unsure

  if (unsureQuestions.length > 0) {
    const reasonsTextUnsure = getReasoningText("Unsicher", unsureQuestions);
    const reasonsTextNegative = getReasoningText("Nein", negativeQuestions);
    const reasonsText = `${reasonsTextUnsure}\n\n${reasonsTextNegative}`;
    return (
      <>
        <Container>
          {heading}
          <div className="mb-32">
            <InlineNotice
              look="support"
              title={result.noticeUnsure.title}
              tagName="h2"
              content={result.noticeUnsure.text}
            />
          </div>
          {getReasoningNotice(result.unsure, reasonsText)}
        </Container>
        <Container>
          <Box
            heading={{
              text: result.boxUnsure.title,
            }}
            content={{
              markdown: result.boxUnsure.text,
            }}
            buttons={[
              {
                id: "result-method-button",
                text: result.boxUnsure.link.text,
                href: result.boxUnsure.link.href,
                look: "tertiary",
              },
            ]}
          />
        </Container>
      </>
    );
  }

  // All answers are negative

  // The recommended way to handle forms with react-hook-form is to use the `handleSubmit` function, however that will always hikack the form submit event and prevent the default behaviour.
  // In our case, we only want to call `event.preventDefault()` when we have validation errors, so we implement a home-made solution that achieves this.
  const onSubmit: FormEventHandler = (event) => {
    void trigger();
    const valid = formState.isValid;

    if (!valid) {
      event.preventDefault();
    }
  };
  const reasonsText = getReasoningText("Nein", negativeQuestions);

  return (
    <>
      <Container>
        {heading}
        {getReasoningNotice(result.negative, reasonsText)}
        <Form
          onSubmit={onSubmit}
          onChange={() => trigger()}
          className="mt-32"
          method="post"
          action="einschaetzung/digitalcheck-vorpruefung.pdf"
          reloadDocument
        >
          <fieldset className="ds-stack-32">
            <legend>{assessment.form.formLegend}</legend>
            <Textarea
              label={assessment.form.reasonLabel}
              register={register("negativeReasoning", {
                required: assessment.form.reasonRequired,
                maxLength: {
                  value: 5000,
                  message: assessment.form.reasonTooLong,
                },
              })}
              error={formState.errors["negativeReasoning"]}
            />
            <Input
              label={assessment.form.policyTitleLabel}
              register={register("title", {
                required: assessment.form.policyTitleRequired,
                maxLength: {
                  value: 500,
                  message: assessment.form.policyTitleTooLong,
                },
              })}
              error={formState.errors["title"]}
            />
            <Button
              text={assessment.form.downloadPdfButton.text}
              look="primary"
              iconLeft={<Download />}
              type="submit"
              className="self-start"
            />
          </fieldset>
        </Form>
      </Container>
      <Container>
        <Heading
          tagName="h2"
          text={result.nextStepsNegative.title}
          className="mb-32"
        />
        <Box
          heading={{
            ...result.nextStepsNegative.step.headline,
            tagName: "h3",
          }}
          content={{
            markdown: result.nextStepsNegative.step.content,
          }}
        />
      </Container>
    </>
  );
}
