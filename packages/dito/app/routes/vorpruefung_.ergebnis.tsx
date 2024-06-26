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
import { MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { getAnswersFromCookie } from "cookies.server";
import { useForm } from "react-hook-form";
import { assessment, preCheck, siteMeta } from "resources/content";
import { PATH_PRECHECK } from "resources/staticRoutes";
import type { Answers, Option } from "./vorpruefung.$questionId";

const { result, questions } = preCheck;

export const meta: MetaFunction = () => {
  return [{ title: `${result.title} — ${siteMeta.title}` }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(PATH_PRECHECK);
  }
  return json({ answers });
}

export async function action({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  const body = await request.formData();
  const values = Object.fromEntries(body);

  const pdfValues = { ...(values as Record<string, string>), ...answers };
  const queryParams = new URLSearchParams(pdfValues).toString();

  return redirect(
    `einschaetzung/digitalcheck-vorpruefung.pdf?${queryParams}&download`,
  );
}

const getQuestionIDsOfOption = (answers: Answers, option: Option["value"]) =>
  Object.keys(answers).filter((key) => answers[key] === option);

export default function Result() {
  const { answers } = useLoaderData<typeof loader>();
  const positiveQuestions = getQuestionIDsOfOption(answers, "yes");
  const unsureQuestions = getQuestionIDsOfOption(answers, "unsure");
  const negativeQuestions = getQuestionIDsOfOption(answers, "no");

  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  // all answers are negative
  const onSubmit = (data: Record<string, string>) => {
    fetcher.submit(data, {
      method: "post",
    });
  };
  const reasonsText = getReasoningText("Nein", negativeQuestions);

  return (
    <>
      <Container>
        {heading}
        {getReasoningNotice(result.negative, reasonsText)}
        <fetcher.Form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-32 ds-stack-32"
        >
          <Textarea
            name="negativeReasoning"
            label={assessment.form.reasonLabel}
            formRegister={register}
            required={assessment.form.reasonRequired}
            error={errors["negativeReasoning"]}
          />
          <Input
            name="title"
            label={assessment.form.policyTitleLabel}
            formRegister={register}
            required={assessment.form.policyTitleRequired}
            error={errors["title"]}
          />
          <Button
            text={result.receivePdfButton.text}
            look="primary"
            iconLeft={<Download />}
            type="submit"
            className="self-start"
          />
        </fetcher.Form>
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
