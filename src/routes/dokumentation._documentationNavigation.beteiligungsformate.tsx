import Heading from "@/components/Heading";
import HelpButton from "@/components/HelpButton";
import RichText from "@/components/RichText";
import Textarea from "@/components/Textarea";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import {
  defaultParticipationValues,
  participationSchema,
} from "@/routes/dokumentation/documentationDataSchema";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useSyncedForm } from "./dokumentation/documentationDataHook";
import { useDocumentationDataService } from "./dokumentation/DocumentationDataProvider";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

const { participation } = digitalDocumentation;

export function DocumentationParticipation() {
  const { currentUrl, nextUrl, previousUrl } = useDocumentationNavigation();
  const { setParticipation, documentationData } = useDocumentationDataService();

  const form = useSyncedForm({
    schema: participationSchema,
    defaultValues: defaultParticipationValues,
    currentUrl,
    setDataCallback: setParticipation,
    storedData: documentationData.participation,
    nextUrl,
  });

  return (
    <div className="space-y-40">
      <Heading
        text={participation.headline}
        tagName="h1"
        look="kern-heading-large"
        className="mb-16"
      />
      <RichText markdown={participation.textIntro} className="gap-40" />

      <form className="space-y-40" {...form.getFormProps()}>
        <fieldset>
          <legend className="kern-heading-medium mb-16">
            {participation.formats.heading}
            <HelpButton sectionId="formats" title="Hinweis zur Erklärung">
              Beschreiben Sie stichpunktartig, wie Sie die Bedürfnisse der
              Betroffenen erhoben haben – z. B. durch Befragungen, Gespräche mit
              Vollzugsakteurinnen und -akteuren oder formelle
              Beteiligungsverfahren.
            </HelpButton>
          </legend>

          <Textarea
            placeholder={participation.formats.textField.placeholder}
            scope={form.scope("formats")}
            data-testid="schritte"
            warningInsteadOfError
          >
            Erklärung
          </Textarea>
        </fieldset>

        <fieldset>
          <legend className="kern-heading-medium mb-16">
            {participation.results.heading}
            <HelpButton sectionId="results" title="Hinweis zu Erkenntnissen">
              Bitte listen Sie stichpunktartig auf, welche Erkenntnisse
              eingearbeitet wurden, und geben Sie Hinweise auf Paragrafen, die
              besonders umsetzungsrelevant sind.
            </HelpButton>
          </legend>
          <Textarea
            scope={form.scope("results")}
            data-testid="erkenntnisse"
            warningInsteadOfError
          >
            Erkenntnisse
          </Textarea>
        </fieldset>

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
