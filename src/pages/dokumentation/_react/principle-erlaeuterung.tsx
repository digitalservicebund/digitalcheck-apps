import AspectPills from "@/components/AspectPills";
import Badge from "@/components/Badge";
import HelpButton from "@/components/HelpButton";
import RichText from "@/components/RichText";
import Textarea from "@/components/Textarea";
import type { Prinzip } from "@/content.config";
import type { PrincipleNumber } from "@/resources/constants";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import DocumentationActions from "./DocumentationActions";
import { useSyncedForm } from "./documentationDataHook";
import { useDocumentationDataService } from "./DocumentationDataProvider";
import type { Principle } from "./documentationDataSchema";
import { principleAnswerSchema } from "./documentationDataSchema";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

const { radioOptions } = digitalDocumentation.principlePages;

type DocumentationPrincipleErlaeuterungFormProps = Readonly<{
  answer: string;
  prinzip: Prinzip;
  principleData: Principle;
  isPositive: boolean;
  isIrrelevant: boolean;
}>;

function DocumentationPrincipleErlaeuterungForm({
  answer,
  prinzip,
  principleData,
  isPositive,
  isIrrelevant,
}: DocumentationPrincipleErlaeuterungFormProps) {
  const { currentUrl, nextUrl, previousUrl } = useDocumentationNavigation();
  const { addOrUpdatePrincipleReasoning } = useDocumentationDataService();

  const form = useSyncedForm({
    schema: principleAnswerSchema,
    defaultValues: { answer, reasoning: "", aspects: [] },
    setDataCallback: (data) =>
      addOrUpdatePrincipleReasoning(
        prinzip.documentId,
        data?.reasoning ?? "",
        isPositive ? data?.aspects : undefined,
      ),
    storedData: {
      answer,
      reasoning: principleData?.reasoning ?? "",
      aspects: principleData?.aspects,
    },
    currentUrl,
    nextUrl,
  });

  let explanationTitle: ReactNode;
  if (isPositive) {
    explanationTitle =
      "Erklären Sie, inwiefern Sie auf dieses Prinzip eingegangen sind";
  } else if (isIrrelevant) {
    explanationTitle = (
      <>
        Erklären Sie, warum das Prinzip <strong>nicht relevant</strong> für Ihr
        Vorhaben ist
      </>
    );
  } else {
    explanationTitle = (
      <>
        Erklären Sie, warum das Prinzip <strong>nicht</strong> auf Ihr Vorhaben
        zutrifft
      </>
    );
  }

  return (
    <form {...form.getFormProps()} className="space-y-80">
      <input {...form.getHiddenInputProps("answer")} />

      <fieldset className="space-y-24">
        <legend className="kern-heading-medium">{explanationTitle}</legend>

        <div className="space-y-48">
          {isPositive && (
            <AspectPills
              aspekte={prinzip.Aspekte}
              scope={form.scope("aspects")}
              error={form.error("aspects")}
              warningInsteadOfError
            >
              <p className="kern-label">
                Schwerpunkte auswählen
                <HelpButton sectionId="aspects" />
              </p>
            </AspectPills>
          )}

          <Textarea
            scope={form.scope("reasoning")}
            rows={5}
            description={
              isPositive &&
              prinzip.Erklaerungshilfe && (
                <RichText markdown={prinzip.Erklaerungshilfe} />
              )
            }
            warningInsteadOfError
          >
            Erklärung
          </Textarea>
        </div>
      </fieldset>

      <DocumentationActions
        previousUrl={previousUrl}
        submit
        showDownloadDraftButton
        showSavingTip
      />
    </form>
  );
}

export function DocumentationPrincipleErlaeuterung({
  principleId,
}: Readonly<{
  principleId: string;
}>) {
  const { currentUrl, navigationBaseUrl, prinzips } =
    useDocumentationNavigation();
  const { documentationData } = useDocumentationDataService();

  const prinzip = prinzips.find(
    ({ URLBezeichnung }) => URLBezeichnung === principleId,
  );

  if (!prinzip)
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Prinzip for slug found", { status: 404 });

  const principleData = documentationData?.principles?.find(
    (p) => p.id === prinzip.documentId,
  );

  const answer = principleData?.answer ?? "";
  const isPositive = answer === radioOptions[0];
  const isIrrelevant = answer === radioOptions[2];

  // If no answer saved yet, redirect to answer page
  useEffect(() => {
    if (documentationData.initialized && !principleData?.answer)
      globalThis.location.href = navigationBaseUrl;
  }, [documentationData, principleData, navigationBaseUrl]);

  if (!principleData?.answer) return null;

  let changeAnswerTitle: string;
  if (isPositive) {
    changeAnswerTitle =
      "Sie haben angegeben, dass das Prinzip auf Ihr Vorhaben zutrifft.";
  } else if (isIrrelevant) {
    changeAnswerTitle =
      "Sie haben angegeben, dass das Prinzip nicht relevant für Ihr Vorhaben ist.";
  } else {
    changeAnswerTitle =
      "Sie haben angegeben, dass das Prinzip nicht auf Ihr Vorhaben zutrifft.";
  }

  return (
    <div className="space-y-48">
      <div className="space-y-24">
        <Badge
          principleNumber={prinzip.Nummer as PrincipleNumber}
          className="mb-8"
        >
          Prinzip {prinzip.order}
        </Badge>
        <h1 className="kern-heading-large mb-16">
          {prinzip.Name}
          <HelpButton sectionId="prinzip" />
        </h1>

        {prinzip.Kurzbeschreibung && (
          <RichText markdown={prinzip.Kurzbeschreibung} />
        )}

        <div className="bg-kern-darkblue-100 rounded-lg p-24">
          <p>{changeAnswerTitle}</p>
          <a href={currentUrl.replace("/erlaeuterung", "")}>Angaben ändern</a>
        </div>
      </div>

      <DocumentationPrincipleErlaeuterungForm
        answer={answer}
        prinzip={prinzip}
        principleData={principleData}
        isPositive={isPositive}
        isIrrelevant={isIrrelevant}
      />
    </div>
  );
}
