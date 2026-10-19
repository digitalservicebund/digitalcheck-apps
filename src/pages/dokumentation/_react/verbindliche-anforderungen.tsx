import {
  dokumentation_bewertungRechtlich,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_zusammenfassung,
} from "@/config/routes.ts";
import { IEAContactBanner } from "@/pages/dokumentation/_react/interoperability/IEAContactBanner.tsx";
import SkipNoticeWrapper from "@/pages/dokumentation/_react/interoperability/SkipNoticeWrapper.tsx";
import DocumentationActions from "./DocumentationActions";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";
import BindingRequirementsForm from "./interoperability/BindingRequirementsForm";

export function DocumentationBindingRequirements() {
  const { previousUrl, nextUrl } = useDocumentationNavigation();

  return (
    <div className="space-y-40">
      <div className={"space-y-8"}>
        <p>EU-Interoperabilität</p>
        <h1 className="kern-heading-large mb-16">
          {dokumentation_verbindlicheAnforderungen.title}
        </h1>
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
