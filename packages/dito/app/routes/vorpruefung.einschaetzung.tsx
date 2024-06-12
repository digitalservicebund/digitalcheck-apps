import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { getAnswersFromCookie } from "cookies.server";
import { assessment } from "resources/content";
import { PATH_RESULT } from "resources/staticRoutes";

export async function action({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);

  const body = await request.formData();
  const { _action, ...values } = Object.fromEntries(body);

  const pdfValues = { ...values, ...answers, download: true };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  const queryParams = new URLSearchParams(pdfValues as any).toString();

  // TODO:
  // if (_action === "receiveEmail") {
  // }

  if (_action === "downloadPdf") {
    return redirect(`digitalcheck-vorpruefung.pdf?${queryParams}`);
  }

  return true;
}

export default function Assessment() {
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
        <Form method="post" reloadDocument>
          <input
            type="text"
            name="email"
            placeholder="email"
            className="border-2 border-black border-solid"
          />
          <br />
          <input
            type="text"
            name="title"
            placeholder="title"
            className="border-2 border-black border-solid"
          />
          <br />
          <input
            type="text"
            name="department"
            placeholder="department"
            className="border-2 border-black border-solid"
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
              id="preCheck-back-button"
              text={assessment.receiveEmailButton.text}
              name="_action"
              value="receiveEmail"
              look="primary"
            ></Button>
            <Button
              id="preCheck-back-button"
              text={assessment.downloadPdfButton.text}
              name="_action"
              value="downloadPdf"
              look="primary"
            ></Button>
          </ButtonContainer>
        </Form>
      </Container>
    </>
  );
}
