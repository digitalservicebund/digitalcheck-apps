import Badge from "@/components/Badge";
import HelpButton from "@/components/HelpButton";
import RadioGroup from "@/components/RadioGroup";
import RichText from "@/components/RichText";
import { prinzipien } from "@/config/routes";
import type { PrincipleNumber } from "@/resources/constants";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import DocumentationActions from "./DocumentationActions";
import { useSyncedForm } from "./documentationDataHook";
import { useDocumentationDataService } from "./DocumentationDataProvider";
import { principleAnswerOnlySchema } from "./documentationDataSchema";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

const { radioOptions } = digitalDocumentation.principlePages;

export function DocumentationPrinciple({
  principleId,
}: Readonly<{
  principleId: string;
}>) {
  const { currentUrl, nextUrl, previousUrl, prinzips } =
    useDocumentationNavigation();
  const prinzip = prinzips.find(
    ({ URLBezeichnung }) => URLBezeichnung === principleId,
  );

  if (!prinzip)
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Prinzip for slug found", { status: 404 });

  const { documentationData, addOrUpdatePrincipleAnswer } =
    useDocumentationDataService();

  const principleData = documentationData?.principles?.find(
    (p) => p.id === prinzip.documentId,
  );

  const storedData = principleData?.answer
    ? { answer: principleData.answer }
    : undefined;

  const form = useSyncedForm({
    schema: principleAnswerOnlySchema,
    defaultValues: { answer: "" },
    setDataCallback: (data) =>
      addOrUpdatePrincipleAnswer(prinzip.documentId, data?.answer ?? ""),
    storedData,
    currentUrl,
    nextUrl,
  });

  return (
    <div className="max-w-a11y space-y-40">
      <div className="space-y-8">
        <Badge principleNumber={prinzip.Nummer as PrincipleNumber}>
          Prinzip {prinzip.order}
        </Badge>
        <h1 className="kern-heading-large mb-16">
          {prinzip.Name}
          <HelpButton
            sectionId="1-prinzip"
            title={`Hinweis zu „${prinzip.Name}“`}
          >
            <RichText markdown={prinzip.Hilfetext} />
            <a href={prinzipien.path + "/" + prinzip.URLBezeichnung}>
              Mehr zum Prinzip
            </a>
          </HelpButton>
        </h1>

        {prinzip.Kurzbeschreibung && (
          <RichText markdown={prinzip.Kurzbeschreibung} />
        )}
      </div>

      <form {...form.getFormProps()} className="space-y-40">
        <h2 id="question-label" className="kern-heading-medium mb-16">
          Schafft das Regelungsvorhaben die rechtlichen Voraussetzungen für die
          Umsetzung des Prinzips?
        </h2>
        <RadioGroup
          aria-labelledby="question-label"
          scope={form.scope("answer")}
          options={radioOptions.map((option) => ({
            value: option,
            label: option,
          }))}
          warningInsteadOfError
        />

        <DocumentationActions
          previousUrl={previousUrl}
          submit
          showDownloadDraftButton
          showSavingTip
        />
      </form>
    </div>
  );
}
