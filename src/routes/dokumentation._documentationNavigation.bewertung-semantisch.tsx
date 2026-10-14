import Badge from "@/components/Badge.tsx";
import DetailsSummary from "@/components/DetailsSummary.tsx";
import Heading from "@/components/Heading";
import RadioGroup from "@/components/RadioGroup.tsx";
import RichText from "@/components/RichText.tsx";
import Textarea from "@/components/Textarea.tsx";
import {
  dokumentation_zusammenfassung,
  interoperabel_loesungen_coreVocabularies,
} from "@/config/routes.ts";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import { useSyncedForm } from "@/routes/dokumentation/documentationDataHook.ts";
import { interoperabilityAssessmentLevelSchema } from "@/routes/dokumentation/documentationDataSchema.ts";
import { IEAContactBanner } from "@/routes/dokumentation/interoperability/IEAContactBanner.tsx";
import SkipNoticeWrapper from "@/routes/dokumentation/interoperability/SkipNoticeWrapper.tsx";
import { interoperabilityRatingOptions } from "@/routes/dokumentation/interoperability/values.ts";
import { dedent } from "@/utils/dedentMultilineStrings";
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
        "Tragen Sie Ihre Erläuterung ein, z. B.: „Datenbegriffe werden gemäß dem Vokabular X einheitlich definiert“."
      }
      scope={scope.scope("detail")}
      rows={5}
      warningInsteadOfError
    >
      Erklärung
    </Textarea>
  );
}

export function DocumentationInteroperabilityAssessmentSemantic() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();

  const { documentationData, setInteroperabilityAssessmentData } =
    useDocumentationDataService();

  const form = useSyncedForm({
    schema: interoperabilityAssessmentLevelSchema,
    defaultValues: {},
    storedData: documentationData.interoperabilityAssessment?.semantic,
    setDataCallback: (data) =>
      setInteroperabilityAssessmentData("semantic", data),
  });

  return (
    <div className="space-y-40">
      <div className={"space-y-8"}>
        <Badge look="hint">Semantische Interoperabilität</Badge>
        <Heading tagName="h1" look="kern-heading-large" className="mb-16">
          Gemeinsame Bedeutung von Daten sicherstellen
        </Heading>
        <p>
          Semantische Klarheit sorgt dafür, dass „was gesendet wird, auch genau
          so verstanden wird“. Rechtsbegriffe müssen gleich definiert und
          Datenfelder kompatibel sein, damit IT-Systeme sie zweifelsfrei
          verarbeiten können.
        </p>
        <DetailsSummary title={"Beispiel"}>
          <RichText
            markdown={dedent`
              Das Datenfeld für „Wohnsitz“ wird in ganz Europa nach demselben
              Standard (z. B. den
              [*Semantic Core Vocabularies*](${interoperabel_loesungen_coreVocabularies.path}))
              definiert. So verstehen das spanische System und das deutsche
              System dasselbe.
              
              Dieser Standard wird in der Regelung referenziert und
              im Vollzug genutzt.
            `}
          />
        </DetailsSummary>
      </div>
      <SkipNoticeWrapper>
        <h2 id="question-label" className="kern-heading-medium mb-16">
          Stellt das Regelungsvorhaben sicher, dass{" "}
          <strong>
            semantische Definitionen von Begriffen und Datenfeldern
          </strong>{" "}
          den Datenaustausch über EU-Grenzen ermöglichen?
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
