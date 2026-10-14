import Badge from "@/components/Badge.tsx";
import DetailsSummary from "@/components/DetailsSummary.tsx";
import Heading from "@/components/Heading";
import RadioGroup from "@/components/RadioGroup.tsx";
import Textarea from "@/components/Textarea.tsx";
import { dokumentation_zusammenfassung } from "@/config/routes.ts";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import { useSyncedForm } from "@/routes/dokumentation/documentationDataHook.ts";
import { interoperabilityAssessmentLevelSchema } from "@/routes/dokumentation/documentationDataSchema.ts";
import { IEAContactBanner } from "@/routes/dokumentation/interoperability/IEAContactBanner.tsx";
import SkipNoticeWrapper from "@/routes/dokumentation/interoperability/SkipNoticeWrapper.tsx";
import { interoperabilityRatingOptions } from "@/routes/dokumentation/interoperability/values.ts";
import type { FormScope } from "@rvf/react";
import { useField } from "@rvf/react";
import type { z } from "zod";
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
        "Tragen Sie Ihre Erläuterung ein, z. B.: „Die Schnittstellen entsprechen dem Standard X“ oder „Das System nutzt das Protokoll Y“."
      }
      scope={scope.scope("detail")}
      rows={5}
      warningInsteadOfError
    >
      Erklärung
    </Textarea>
  );
}

export function DocumentationInteroperabilityAssessmentTechnical() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();

  const { documentationData, setInteroperabilityAssessmentData } =
    useDocumentationDataService();

  const form = useSyncedForm({
    schema: interoperabilityAssessmentLevelSchema,
    defaultValues: { detail: "", rating: "" },
    storedData: documentationData.interoperabilityAssessment?.technical,
    setDataCallback: (data) =>
      setInteroperabilityAssessmentData("technical", data),
  });

  return (
    <div className="space-y-40">
      <div className={"space-y-8"}>
        <Badge look="hint">Technische Interoperabilität</Badge>
        <Heading tagName="h1" look="kern-heading-large" className="mb-16">
          Technische Voraussetzungen für den Datenaustausch schaffen
        </Heading>
        <p>
          Die technische Ebene der Interoperabilität sorgt dafür, dass
          verschiedene Verwaltungen über kompatible IT-Systeme, Datenstandards
          und Schnittstellen (APIs) tatsächlich miteinander kommunizieren können
          - ohne manuelle Anpassungen pro Fall.
        </p>
        <DetailsSummary title={"Beispiel"}>
          Der Austausch von Nachweisen zwischen Behörden erfolgt vollautomatisch
          im Hintergrund über standardisierte Schnittstellen (APIs) und
          gesicherte europäische Netze.
        </DetailsSummary>
      </div>
      <SkipNoticeWrapper>
        <h2 id="question-label" className="kern-heading-medium mb-16">
          Schafft das Regelungsvorhaben die <strong>technischen</strong>{" "}
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
