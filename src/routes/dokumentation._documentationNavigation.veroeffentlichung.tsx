import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider";
import { useSyncedForm } from "@/routes/dokumentation/documentationDataHook";
import { interoperabilityMetaSchema } from "@/routes/dokumentation/documentationDataSchema";
import SkipNoticeWrapper from "@/routes/dokumentation/interoperability/SkipNoticeWrapper";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";
// Astro page export
import RadioGroup from "@/components/RadioGroup";
import {
  publicationDateQuestion,
  publicationLinkQuestion,
  publicationStatusQuestion,
} from "@/routes/dokumentation/interoperability/values.ts";
import { useField } from "@rvf/react";

export function DocumentationVeroeffentlichung() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();
  const { documentationData, setInteroperabilityMeta } =
    useDocumentationDataService();

  const form = useSyncedForm({
    schema: interoperabilityMetaSchema,
    defaultValues: { publicationStatus: "", publicationDate: "" },
    storedData: documentationData.interoperabilityMeta,
    setDataCallback: (data) => setInteroperabilityMeta(data),
  });

  const publicationStatusField = useField(form.scope("publicationStatus"));
  const publicationDateField = useField(form.scope("publicationDate"));
  const publicationLinkField = useField(form.scope("publicationLink"));

  return (
    <div className="space-y-40">
      <Heading tagName="h1" look="kern-heading-large">
        Veröffentlichung
      </Heading>
      <SkipNoticeWrapper>
        <form {...form.getFormProps()} className="space-y-32">
          <h2 className="kern-heading-medium mb-16" id="status-question-label">
            {publicationStatusQuestion.questionLabel}
          </h2>

          <div>
            <RadioGroup
              aria-labelledby="status-question-label"
              scope={form.scope("publicationStatus")}
              options={publicationStatusQuestion.options}
              warningInsteadOfError
              onChange={(e) => {
                if (e.target.value === "planned") {
                  publicationLinkField.setValue("");
                } else if (e.target.value === "published") {
                  publicationDateField.setValue("");
                }
              }}
            />
          </div>

          {publicationStatusField.value() === "planned" && (
            <div className="mt-16 ml-28">
              <Input
                description="Eine ungefähre Angabe (Monat) ist ausreichend."
                scope={form.scope("publicationDate")}
              >
                {publicationDateQuestion.questionLabel}
              </Input>
            </div>
          )}

          {publicationStatusField.value() === "published" && (
            <div className="mt-16 ml-28">
              <Input scope={form.scope("publicationLink")}>
                {publicationLinkQuestion.questionLabel}
              </Input>
            </div>
          )}
        </form>
      </SkipNoticeWrapper>
      <DocumentationActions previousUrl={previousUrl} nextUrl={nextUrl ?? ""} />
    </div>
  );
}
