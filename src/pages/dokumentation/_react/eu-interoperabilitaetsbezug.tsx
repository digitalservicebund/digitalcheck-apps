import HelpButton from "@/components/HelpButton.tsx";
import RadioGroup from "@/components/RadioGroup.tsx";
import RichText from "@/components/RichText.tsx";
import { interoperabel } from "@/config/routes.ts";
import { useSyncedForm } from "@/pages/dokumentation/_react/documentationDataHook.ts";
import { useDocumentationDataService } from "@/pages/dokumentation/_react/DocumentationDataProvider.tsx";
import type { EuInteroperabilityOutcome } from "@/pages/dokumentation/_react/documentationDataSchema.ts";
import { euInteroperabilityOutcomeSchema } from "@/pages/dokumentation/_react/documentationDataSchema.ts";
import { IEAContactBanner } from "@/pages/dokumentation/_react/interoperability/IEAContactBanner.tsx";
import { markdownLinkIEA } from "@/pages/dokumentation/_react/interoperability/markdownLinkIEA.tsx";
import { euInteroperabilityQuestion } from "@/pages/dokumentation/_react/interoperability/values.ts";
import { useId } from "react";
import DocumentationActions from "./DocumentationActions";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

export const helpText = `
**Was bedeutet das?**

Sofern durch Ihre Regelung vorgesehen ist, dass Daten und Informationen zwischen
Verwaltungen von EU-Mitgliedstaaten ausgetauscht werden, muss nach
${markdownLinkIEA({ article: 3, format: "long" })} in der Regel
eine Interoperabilitätsbewertung durchgeführt werden.

<p><a class="mb-8" href="${interoperabel.path}#verbindliche-anforderungen" target="_blank" rel="noreferrer">
Wann ist eine Interoperabilitäts-Bewertung verpflichtend?
</a></p>

Sollte sich nach den Bestimmungen der Verordnung dennoch keine Verpflichtung zu einer Bewertung ergeben und Sie möchten auch keine freiwillige Bewertung durchführen, wählen Sie die Option „Nein, es ist kein Bezug vorhanden“.
`;

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
          <HelpButton
            sectionId="bezug-interoperabilität"
            title={"Bezug zu EU-Interoperabilität"}
          >
            <RichText markdown={helpText} />
          </HelpButton>
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
