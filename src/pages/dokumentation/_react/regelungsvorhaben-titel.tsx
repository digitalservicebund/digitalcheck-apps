import HelpButton from "@/components/HelpButton";
import Input from "@/components/Input";
import {
  defaultTitleValues,
  policyTitleSchema,
} from "@/pages/dokumentation/_react/documentationDataSchema";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import DocumentationActions from "./DocumentationActions";
import { useSyncedForm } from "./documentationDataHook";
import { useDocumentationDataService } from "./DocumentationDataProvider";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

const { info } = digitalDocumentation;

export function DocumentationTitle() {
  const { currentUrl, nextUrl, previousUrl } = useDocumentationNavigation();
  const { documentationData, setPolicyTitle } = useDocumentationDataService();

  const form = useSyncedForm({
    schema: policyTitleSchema,
    defaultValues: defaultTitleValues,
    currentUrl,
    setDataCallback: setPolicyTitle,
    storedData: documentationData.policyTitle,
    nextUrl,
  });

  return (
    <div className="space-y-40">
      <h1 className="kern-heading-large mb-40">
        {info.headline}
        <HelpButton
          sectionId="title"
          title="Hinweis zu Titel des Regelungsvorhabens"
        >
          Geben Sie hier den offiziellen Titel Ihres Regelungsvorhabens ein.
          Dieser Titel wird in der fertigen Dokumentation verwendet.
        </HelpButton>
      </h1>

      <form {...form.getFormProps()}>
        <div className="space-y-32">
          <Input scope={form.scope("title")} warningInsteadOfError>
            {info.inputTitle.label}
          </Input>

          <Input scope={form.scope("organization")} warningInsteadOfError>
            Ministerium / Organisation
          </Input>
        </div>

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

export default function Route() {
  return <DocumentationTitle />;
}
