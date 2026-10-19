import HelpButton from "@/components/HelpButton";
import RichText from "@/components/RichText";
import Textarea from "@/components/Textarea";
import {
  defaultParticipationValues,
  participationSchema,
} from "@/pages/dokumentation/_react/documentationDataSchema";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import DocumentationActions from "./DocumentationActions";
import { useSyncedForm } from "./documentationDataHook";
import { useDocumentationDataService } from "./DocumentationDataProvider";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

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
      <h1 className="kern-heading-large mb-16">{participation.headline}</h1>
      <RichText markdown={participation.textIntro} className="gap-40" />

      <form className="space-y-40" {...form.getFormProps()}>
        <fieldset>
          <legend className="kern-heading-medium mb-16">
            {participation.formats.heading}
            <HelpButton sectionId="formats" />
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
            <HelpButton sectionId="results" />
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
