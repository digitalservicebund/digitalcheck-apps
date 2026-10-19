import { DocumentationPageShell } from "@/components/DocumentationPageShell.tsx";
import {
  dokumentation_absenden,
  dokumentation_beteiligungsformate,
  dokumentation_bewertungOrganisatorisch,
  dokumentation_bewertungRechtlich,
  dokumentation_bewertungSemantisch,
  dokumentation_bewertungTechnisch,
  dokumentation_euInteroperabilitaetsbezug,
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_veroeffentlichung,
  dokumentation_zusammenfassung,
} from "@/config/routes.ts";
import type { Prinzip } from "@/content.config";
import { DocumentationSend } from "@/pages/dokumentation/_react/absenden.tsx";
import { DocumentationParticipation } from "@/pages/dokumentation/_react/beteiligungsformate.tsx";
import { DocumentationInteroperabilityAssessmentOrganizational } from "@/pages/dokumentation/_react/bewertung-organisatorisch.tsx";
import { DocumentationInteroperabilityAssessmentLegal } from "@/pages/dokumentation/_react/bewertung-rechtlich.tsx";
import { DocumentationInteroperabilityAssessmentSemantic } from "@/pages/dokumentation/_react/bewertung-semantisch.tsx";
import { DocumentationInteroperabilityAssessmentTechnical } from "@/pages/dokumentation/_react/bewertung-technisch.tsx";
import { DocumentationEuInteroperabilityRequirements } from "@/pages/dokumentation/_react/eu-interoperabilitaetsbezug.tsx";
import { DocumentationHinweise } from "@/pages/dokumentation/_react/hinweise.tsx";
import { DocumentationPrincipleErlaeuterung } from "@/pages/dokumentation/_react/principle-erlaeuterung.tsx";
import { DocumentationPrinciple } from "@/pages/dokumentation/_react/principle.tsx";
import { DocumentationTitle } from "@/pages/dokumentation/_react/regelungsvorhaben-titel.tsx";
import { DocumentationBindingRequirements } from "@/pages/dokumentation/_react/verbindliche-anforderungen.tsx";
import { DocumentationVeroeffentlichung } from "@/pages/dokumentation/_react/veroeffentlichung.tsx";
import { DocumentationSummary } from "@/pages/dokumentation/_react/zusammenfassung.tsx";
import type { ComponentType } from "react";

const staticRoutes: Record<string, ComponentType> = {
  [dokumentation_hinweise.path]: DocumentationHinweise,
  [dokumentation_regelungsvorhabenTitel.path]: DocumentationTitle,
  [dokumentation_beteiligungsformate.path]: DocumentationParticipation,
  // "Prinzipien" steps handled dynamically below
  [dokumentation_euInteroperabilitaetsbezug.path]:
    DocumentationEuInteroperabilityRequirements,
  [dokumentation_verbindlicheAnforderungen.path]:
    DocumentationBindingRequirements,
  [dokumentation_bewertungRechtlich.path]:
    DocumentationInteroperabilityAssessmentLegal,
  [dokumentation_bewertungOrganisatorisch.path]:
    DocumentationInteroperabilityAssessmentOrganizational,
  [dokumentation_bewertungSemantisch.path]:
    DocumentationInteroperabilityAssessmentSemantic,
  [dokumentation_bewertungTechnisch.path]:
    DocumentationInteroperabilityAssessmentTechnical,
  [dokumentation_veroeffentlichung.path]: DocumentationVeroeffentlichung,
  [dokumentation_zusammenfassung.path]: DocumentationSummary,
  [dokumentation_absenden.path]: DocumentationSend,
};

export type DocumentationRouterProps = {
  prinzips: Prinzip[];
  path: string;
  principleId?: string;
  isErlaeuterung?: boolean;
};

export function DocumentationRouter({
  path,
  prinzips,
  principleId,
  isErlaeuterung = false,
}: Readonly<DocumentationRouterProps>) {
  const StaticComponent = staticRoutes[path];

  const PrincipleComponent = isErlaeuterung
    ? DocumentationPrincipleErlaeuterung
    : DocumentationPrinciple;

  return (
    <DocumentationPageShell prinzips={prinzips} currentUrl={path}>
      {StaticComponent && <StaticComponent />}
      {principleId && (
        <PrincipleComponent key={principleId} principleId={principleId} />
      )}
    </DocumentationPageShell>
  );
}
