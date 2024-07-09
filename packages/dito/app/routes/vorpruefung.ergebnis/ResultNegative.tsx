import { type FormEventHandler } from "react";
import { type FieldValues, useForm } from "react-hook-form";

import Button from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import Input from "@digitalcheck/shared/components/Input";
import Textarea from "@digitalcheck/shared/components/Textarea";
import Download from "@digitalservicebund/icons/Download.js";

import List from "@digitalcheck/shared/components/List";
import { Form } from "@remix-run/react";
import { assessment, preCheck } from "resources/content";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { title, reasoningIntro, nextSteps } = preCheck.result.negative;

export default function ResultNegative({
  negativeQuestions,
}: Readonly<{
  negativeQuestions: string[];
}>) {
  const { register, formState, trigger } = useForm<FieldValues>();

  // The recommended way to handle forms with react-hook-form is to use the `handleSubmit` function, however that will always hikack the form submit event and prevent the default behaviour.
  // In our case, we only want to call `event.preventDefault()` when we have validation errors, so we implement a home-made solution that achieves this.
  const onSubmit: FormEventHandler = (event) => {
    void trigger();
    const valid = formState.isValid;

    if (!valid) {
      event.preventDefault();
    }
  };
  const reasonsText = getReasoningText(
    negativeQuestions,
    reasoningIntro,
    "negativeResult",
  );

  return (
    <>
      <ResultHeader
        resultType="negative"
        resultHeading={title}
        reasonsText={reasonsText}
        resultBackgroundColor="midBlue"
      >
        <Form
          onSubmit={onSubmit}
          onChange={() => trigger()}
          className="mt-32"
          method="post"
          action="einschaetzung/digitalcheck-vorpruefung.pdf"
          reloadDocument
        >
          <fieldset className="ds-stack-32">
            <legend>
              <Heading
                tagName="h3"
                text={assessment.form.formLegend}
                className="mb-16"
              />
            </legend>
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
              size="large"
              iconLeft={<Download />}
              type="submit"
              className="self-start"
            />
          </fieldset>
        </Form>
      </ResultHeader>
      <Container>
        <List
          heading={{
            text: nextSteps.title,
            tagName: "h2",
          }}
          items={nextSteps.steps}
          isNumeric
        />
      </Container>
    </>
  );
}
