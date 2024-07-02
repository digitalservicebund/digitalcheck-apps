import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Input from "@digitalcheck/shared/components/Input";
import Download from "@digitalservicebund/icons/Download";
import { redirectDocument, type LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useFetcher } from "@remix-run/react";
import { getAnswersFromCookie } from "cookies.server";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { assessment, siteMeta } from "resources/content";
import { PATH_RESULT } from "resources/staticRoutes";

export const meta: MetaFunction = () => {
  return [{ title: `${assessment.title} — ${siteMeta.title}` }];
};

export async function action({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  const body = await request.formData();
  const values = Object.fromEntries(body) as FieldValues;
  const pdfValues = { ...values, ...answers };
  const queryParams = new URLSearchParams(pdfValues).toString();

  return redirectDocument(
    `digitalcheck-vorpruefung.pdf?${queryParams}&download`,
  );
}

export default function Assessment() {
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    fetcher.submit(data, { method: "post" });
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
        <fetcher.Form onSubmit={handleSubmit(onSubmit)} method="post">
          <Input
            name="title"
            label={assessment.form.policyTitleLabel}
            formRegister={register}
            required={assessment.form.policyTitleRequired}
            error={errors["title"]}
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
              // type="submit"
              look="primary"
              iconLeft={<Download />}
            ></Button>
          </ButtonContainer>
        </fetcher.Form>
      </Container>
    </>
  );
}
