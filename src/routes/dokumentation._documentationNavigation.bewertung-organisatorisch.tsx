import Badge from "@/components/Badge.tsx";
import DetailsSummary from "@/components/DetailsSummary.tsx";
import Heading from "@/components/Heading";
import RadioGroup from "@/components/RadioGroup.tsx";
import Textarea from "@/components/Textarea.tsx";
import type { FormScope } from "@rvf/react";
import { useField } from "@rvf/react";
import type { z } from "zod";

import RichText from "@/components/RichText.tsx";
import { dokumentation_zusammenfassung } from "@/config/routes.ts";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import { useSyncedForm } from "@/routes/dokumentation/documentationDataHook.ts";
import { interoperabilityAssessmentLevelSchema } from "@/routes/dokumentation/documentationDataSchema.ts";
import { IEAContactBanner } from "@/routes/dokumentation/interoperability/IEAContactBanner.tsx";
import SkipNoticeWrapper from "@/routes/dokumentation/interoperability/SkipNoticeWrapper.tsx";
import { interoperabilityRatingOptions } from "@/routes/dokumentation/interoperability/values.ts";
import { dedent } from "@/utils/dedentMultilineStrings";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

function DetailFormElement({
  scope,
}: Readonly<{
  scope: FormScope<z.infer<typeof interoperabilityAssessmentLevelSchema>>;
}>) {
  const field = useField(scope.scope("rating"));
  const radioValue = field.value();
  if (!radioValue || radioValue === "not-applicable") {
    return null;
  }
  return (
    <Textarea
      description={
        "Tragen Sie Ihre Erläuterung ein, z. B.: „Anträge müssen innerhalb von 3 Tagen an die zuständige Stelle weitergeleitet werden“ und die Benennung der zuständigen Behörden."
      }
      scope={scope.scope("detail")}
      rows={5}
      warningInsteadOfError
    >
      Erklärung
    </Textarea>
  );
}

export function DocumentationInteroperabilityAssessmentOrganizational() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();

  const { documentationData, setInteroperabilityAssessmentData } =
    useDocumentationDataService();

  const form = useSyncedForm({
    schema: interoperabilityAssessmentLevelSchema,
    defaultValues: { detail: "", rating: "" },
    storedData: documentationData.interoperabilityAssessment?.organizational,
    setDataCallback: (data) =>
      setInteroperabilityAssessmentData("organizational", data),
  });

  return (
    <div className="space-y-40">
      <div className={"space-y-8"}>
        <Badge look="hint">Organisatorische Interoperabilität</Badge>
        <Heading tagName="h1" look="kern-heading-large" className="mb-16">
          Organisatorische Strukturen für Interoperabilität
        </Heading>
        <p>
          Zuständigkeiten und Prozesse müssen so ausgestaltet sein, dass die
          Zusammenarbeit zwischen Behörden unterschiedlicher EU-Mitgliedstaaten
          reibungslos funktionieren kann.
        </p>
        <DetailsSummary title={"Beispiel"}>
          <RichText
            markdown={dedent`
          **Szenario: internationale Gewerbeummeldung**
          
          Wenn ein Unternehmen seinen Standort von Deutschland nach Spanien verlegt,
          sollten die beteiligten Behörden beider Länder (z. B. über das **Single Digital Gateway**)
          **zusammenarbeiten** können, damit die Gewerbeummeldung abgewickelt werden kann.
          Dazu müssen die organisatorischen Prozesse und Zuständigkeiten vorhanden sein.
          `}
          />
        </DetailsSummary>
      </div>
      <SkipNoticeWrapper>
        <h2 id="question-label" className="kern-heading-medium mb-16">
          Schafft das Regelungsvorhaben die <strong>organisatorischen</strong>{" "}
          Voraussetzungen für einen Datenaustausch innerhalb der EU?
        </h2>
        <RadioGroup
          aria-labelledby="question-label"
          scope={form.scope("rating")}
          options={interoperabilityRatingOptions}
          warningInsteadOfError
        />
        <DetailFormElement scope={form.scope()} />
      </SkipNoticeWrapper>
      <DocumentationActions
        previousUrl={previousUrl}
        nextUrl={nextUrl ?? dokumentation_zusammenfassung.path}
        showDownloadDraftButton
        showSavingTip
      />
      <IEAContactBanner />
    </div>
  );
}
