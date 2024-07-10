import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Input from "@digitalcheck/shared/components/Input";
import Download from "@digitalservicebund/icons/Download";
import { Form, MetaFunction } from "@remix-run/react";
import { FormEventHandler } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { assessment, siteMeta } from "resources/content";
import { PATH_RESULT } from "resources/staticRoutes";

export const meta: MetaFunction = () => {
  return [{ title: `${assessment.title} — ${siteMeta.title}` }];
};

export default function Assessment() {
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

  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h1",
            text: assessment.title,
            look: "ds-heading-02-reg",
          }}
          content={{
            markdown: assessment.subtitle,
          }}
        ></Box>
      </Container>
      <Container paddingBottom="48">
        <Form
          onSubmit={onSubmit}
          onChange={() => trigger()}
          method="post"
          action="digitalcheck-vorpruefung.pdf"
          reloadDocument
        >
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
          <br />
          <ButtonContainer>
            <Button
              id="assessment-back-button"
              text="Zurück"
              href={PATH_RESULT}
              look="tertiary"
            ></Button>
            <Button
              id="assessment-download-button"
              text={assessment.form.downloadPdfButton.text}
              type="submit"
              look="primary"
              iconLeft={<Download />}
            ></Button>
          </ButtonContainer>
        </Form>
      </Container>
    </>
  );
}
