import Badge from "@/components/Badge";
import Heading from "@/components/Heading";
import HelpButton from "@/components/HelpButton";
import RadioGroup from "@/components/RadioGroup";
import RichText from "@/components/RichText";
import { prinzipien } from "@/config/routes";
import type { PrincipleNumber } from "@/resources/constants";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useSyncedForm } from "./dokumentation/documentationDataHook";
import { useDocumentationDataService } from "./dokumentation/DocumentationDataProvider";
import { principleAnswerOnlySchema } from "./dokumentation/documentationDataSchema";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

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
        <Heading tagName="h1" look="kern-heading-large" className="mb-16">
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
        </Heading>

        {prinzip.Kurzbeschreibung && (
          <RichText markdown={prinzip.Kurzbeschreibung} />
        )}
      </div>

      <form {...form.getFormProps()} className="space-y-40">
        <Heading
          id="question-label"
          tagName="h2"
          look="kern-heading-medium"
          className="mb-16"
        >
          Schafft das Regelungsvorhaben die rechtlichen Voraussetzungen für die
          Umsetzung des Prinzips?
        </Heading>
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
