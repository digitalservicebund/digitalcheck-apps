import HelpButton from "@/components/HelpButton.tsx";
import RadioGroup from "@/components/RadioGroup.tsx";
import { useSyncedForm } from "@/pages/dokumentation/_react/documentationDataHook.ts";
import { useDocumentationDataService } from "@/pages/dokumentation/_react/DocumentationDataProvider.tsx";
import type { EuInteroperabilityOutcome } from "@/pages/dokumentation/_react/documentationDataSchema.ts";
import { euInteroperabilityOutcomeSchema } from "@/pages/dokumentation/_react/documentationDataSchema.ts";
import { IEAContactBanner } from "@/pages/dokumentation/_react/interoperability/IEAContactBanner.tsx";
import { euInteroperabilityQuestion } from "@/pages/dokumentation/_react/interoperability/values.ts";
import { useId } from "react";
import DocumentationActions from "./DocumentationActions";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

const defaultValues: EuInteroperabilityOutcome = {
  outcomeId: undefined,
};

export function DocumentationEuInteroperabilityRequirements() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();
  const labelId = useId();
  const { documentationData, setEuInteroperabilityOutcome } =
    useDocumentationDataService();

  const form = useSyncedForm({
    schema: euInteroperabilityOutcomeSchema,
    defaultValues,
    storedData: documentationData.euInteroperabilityOutcome,
    setDataCallback: (data) => {
      setEuInteroperabilityOutcome(data ?? {});
    },
  });

  return (
    <div className="space-y-40">
      <h1 className="kern-heading-large mb-16">
        Bezug zur EU-Interoperabilität
      </h1>
      <form {...form.getFormProps()} className="space-y-20">
        <div>
          <p className="inline" id={labelId}>
            {euInteroperabilityQuestion.label}
          </p>
          <HelpButton sectionId="bezug-interoperabilität" />
        </div>

        <RadioGroup
          scope={form.scope("outcomeId")}
          options={euInteroperabilityQuestion.options}
          aria-labelledby={labelId}
        />
      </form>

      <DocumentationActions
        previousUrl={previousUrl}
        nextUrl={nextUrl}
        showDownloadDraftButton
        showSavingTip
      />

      <IEAContactBanner />
    </div>
  );
}
