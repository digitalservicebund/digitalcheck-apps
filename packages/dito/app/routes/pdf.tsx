import Button from "@digitalcheck/shared/components/Button.tsx";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer.tsx";
import RichText from "@digitalcheck/shared/components/RichText";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as fs from "node:fs";
import * as path from "node:path";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { pdf, siteMeta } from "resources/content";
import createFilledPDF, {
  FIELD_NAME_PRE_CHECK_QUESTION_1,
} from "../services/pdf-service.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: siteMeta.title },
    {
      name: "description",
      content: siteMeta.description,
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const filePath = path.resolve("app/resources/dc-pre-check-raw.pdf");
  const fileData = fs.readFileSync(filePath);
  return { rawFileData: new Uint8Array(fileData) };
};

export default function PdfPage() {
  const [downloadUrl, setDownloadUrl] = useState("");
  const { rawFileData } = useLoaderData();

  const { handleSubmit }: UseFormReturn = useForm();

  const onSubmit = async () => {
    const pdfData: Uint8Array = await createFilledPDF(rawFileData, {
      policyTitle: "Titel des Regelungsvorhabens",
      preCheckAnswers: [
        {
          name: FIELD_NAME_PRE_CHECK_QUESTION_1,
          checked: true,
        },
      ],
    });

    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  return (
    <main className="">
      <div className="container ds-stack-16 pt-40 pb-48">
        <h1>{pdf.title}</h1>
        <RichText markdown={pdf.subtitle} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ButtonContainer>
            <Button
              id={"download-pdf"}
              text={"Als PDF herunterladen"}
              size={"large"}
              type={"submit"}
            />
            {downloadUrl && (
              <a href={downloadUrl} download="filled-form.pdf">
                Click here to download
              </a>
            )}
          </ButtonContainer>
        </form>
      </div>
    </main>
  );
}
