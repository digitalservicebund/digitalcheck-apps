import Heading from "@/components/Heading";
import {
  dokumentation_bewertungRechtlich,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_zusammenfassung,
} from "@/config/routes.ts";
import { IEAContactBanner } from "@/routes/dokumentation/interoperability/IEAContactBanner.tsx";
import SkipNoticeWrapper from "@/routes/dokumentation/interoperability/SkipNoticeWrapper.tsx";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";
import BindingRequirementsForm from "./dokumentation/interoperability/BindingRequirementsForm";

export function DocumentationBindingRequirements() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();

  return (
    <div className="space-y-40">
      <div className={"space-y-8"}>
        <p>EU-Interoperabilität</p>
        <Heading
          text={dokumentation_verbindlicheAnforderungen.title}
          tagName="h1"
          look="kern-heading-large"
          className="mb-16"
        />
      </div>
      <SkipNoticeWrapper>
        <BindingRequirementsForm
          nextUrl={dokumentation_bewertungRechtlich.path}
        />
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
