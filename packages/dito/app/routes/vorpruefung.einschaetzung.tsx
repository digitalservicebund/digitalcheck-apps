import Button from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { assessment } from "resources/content";

export async function action({ request }: LoaderFunctionArgs) {
  const body = await request.formData();

  // Get results of form submission and inject them into the PDF
  // Potentially also send this to their email?
  // Ask:
  // - Do we use PDF v3?
  // - What to do in case of "maybe"
  // - Do we email this to user?
  // - Do we email this to user?

  return json({ answers });
}

export default function Assessment() {
  return (
    <>
      <Container>
        <Heading
          tagName="h1"
          text={assessment.title}
          look="ds-heading-02-reg"
          className="mb-32"
        />
        <Form method="post">
          <input type="text" name="title" />
          <button type="submit">Create Todo</button>
          <Button {...assessment.downloadPdfButton} />
        </Form>
      </Container>
    </>
  );
}
