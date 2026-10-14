import type { BadgeProps } from "@/components/Badge";
import Heading from "@/components/Heading";
import type { InfoBoxProps } from "@/components/InfoBox";
import InfoBox from "@/components/InfoBox";
import InfoBoxList from "@/components/InfoBoxList";
import InlineNotice from "@/components/InlineNotice";
import RichText from "@/components/RichText";
import {
  dokumentation_beteiligungsformate,
  dokumentation_bewertungOrganisatorisch,
  dokumentation_bewertungRechtlich,
  dokumentation_bewertungSemantisch,
  dokumentation_bewertungTechnisch,
  dokumentation_euInteroperabilitaetsbezug,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_veroeffentlichung,
  type Route,
} from "@/config/routes";
import type { Prinzip } from "@/content.config";
import type { PrincipleNumber } from "@/resources/constants";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import {
  type BindingRequirementsData,
  type DocumentationData,
  type InteroperabilityMeta,
  type Participation,
  type PolicyTitle,
  type Principle,
} from "@/routes/dokumentation/documentationDataSchema";
import RequirementDetail from "@/routes/dokumentation/interoperability/RequirementDetail.tsx";
import {
  formatRating,
  publicationDateQuestion,
  publicationLinkQuestion,
  publicationStatusQuestion,
} from "@/routes/dokumentation/interoperability/values.ts";
import { keyValueToMap } from "@/utils/keyValue.ts";
import { slugify } from "@/utils/utilFunctions";
import type { ReactNode } from "react";
import DocumentationActions from "./dokumentation/DocumentationActions";
import { useDocumentationDataService } from "./dokumentation/DocumentationDataProvider";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

const {
  summary,
  principlePages: { radioOptions },
} = digitalDocumentation;

const createInfoBoxItem = ({
  route,
  heading,
  content,
  badge,
}: {
  route: Pick<Route, "title" | "path">;
  heading?: string;
  content?: ReactNode;
  badge?: BadgeProps;
}): InfoBoxProps => ({
  identifier: route.path,
  testId: route.path,
  heading: {
    text: heading ?? route.title,
    tagName: "h2",
    look: "kern-heading-medium",
  },
  badge: badge,
  children: (
    <div className="mt-24">
      {content ? (
        <div className="space-y-24">{content}</div>
      ) : (
        <InlineNotice
          look="missingOrIncomplete"
          heading={summary.warnings.missing}
        />
      )}
      <a
        href={route.path}
        className="mt-24 block"
        aria-label={`${route.title} ${summary.buttonEdit.ariaLabelSuffix}`}
      >
        {summary.buttonEdit.text}
      </a>
    </div>
  ),
  look: "highlight",
  className: "bg-white sm:px-40",
});

function Answer({
  heading,
  answers,
}: Readonly<{
  heading?: string;
  answers: { prefix: string; answer?: string }[];
}>) {
  return (
    <div className="space-y-24">
      {heading && <Heading tagName="h3">{heading}</Heading>}
      {answers
        .filter(({ answer }) => answer)
        .map(({ answer, prefix }) => (
          <div className="space-y-8" key={prefix + answer}>
            <Heading tagName="h4">{prefix}</Heading>
            <p>{answer}</p>
          </div>
        ))}
      {answers.some(({ answer }) => !answer) && (
        <InlineNotice
          look="missingOrIncomplete"
          key={heading}
          heading={summary.warnings.incomplete}
        />
      )}
    </div>
  );
}

function PolicyTitleContent({
  policyTitle,
}: Readonly<{ policyTitle: PolicyTitle }>) {
  const titleAnswer = {
    prefix: "Vorläufiger Arbeitstitel des Vorhabens",
    answer: policyTitle.title,
  };
  const ministryAnswer = {
    prefix: "Ministerium / Organisation",
    answer: policyTitle.organization,
  };
  return <Answer answers={[titleAnswer, ministryAnswer]} />;
}

function ParticipationContent({
  participation,
}: Readonly<{
  participation: Participation;
}>) {
  return (
    <>
      <Answer
        answers={[
          {
            prefix: "Auswirkungen auf Betroffene",
            answer: participation.formats,
          },
        ]}
      />
      <Answer
        answers={[
          {
            prefix: "Auswirkungen auf die Umsetzung",
            answer: participation.results,
          },
        ]}
      />
    </>
  );
}

function SimplifiedAspectsContent({
  explanation,
  aspects,
  prinzip,
  needsAspects,
}: Readonly<{
  explanation: Principle["reasoning"];
  aspects: Principle["aspects"];
  prinzip: Prinzip;
  needsAspects: boolean;
}>) {
  if ((needsAspects && (!aspects || aspects.length === 0)) || !explanation) {
    return (
      <InlineNotice
        look="missingOrIncomplete"
        heading={summary.warnings.incomplete}
      />
    );
  }
  return (
    <>
      {aspects?.length && (
        <div className="space-y-8">
          <Heading tagName="h4">Schwerpunkte</Heading>
          <div className="flex flex-wrap gap-16">
            {aspects.map((aspect) => {
              const aspekt = prinzip.Aspekte.find(
                (a) => slugify(a.Kurzbezeichnung) === aspect,
              );
              return (
                <span
                  key={aspect}
                  className="border-kern-darkblue-150 bg-kern-darkblue-150 rounded-full border px-16 py-6 text-sm font-medium"
                >
                  {aspekt ? aspekt.Kurzbezeichnung : aspect}
                </span>
              );
            })}
          </div>
        </div>
      )}
      <Answer answers={[{ prefix: "Erläuterung", answer: explanation }]} />
    </>
  );
}

function PrincipleContent({
  principle,
  prinzip,
}: Readonly<{
  principle: Principle;
  prinzip: Prinzip;
  simplified?: boolean;
}>) {
  return (
    <>
      <Answer
        answers={[
          { prefix: "Wird dieses Prinzip erfüllt?", answer: principle.answer },
        ]}
      />

      <SimplifiedAspectsContent
        explanation={principle.reasoning}
        aspects={principle.aspects}
        prinzip={prinzip}
        needsAspects={principle.answer === radioOptions[0]}
      />
    </>
  );
}

function InteroperabilityMetaContent({
  interoperabilityMeta,
}: Readonly<{ interoperabilityMeta: InteroperabilityMeta }>) {
  const labels = keyValueToMap(publicationStatusQuestion.options);
  const answers = [
    {
      prefix: publicationStatusQuestion.questionLabel,
      answer: labels.get(interoperabilityMeta.publicationStatus),
    },
  ];
  if (interoperabilityMeta.publicationLink) {
    answers.push({
      prefix: publicationLinkQuestion.questionLabel,
      answer: interoperabilityMeta.publicationLink,
    });
  }
  if (interoperabilityMeta.publicationDate) {
    answers.push({
      prefix: publicationDateQuestion.questionLabel,
      answer: interoperabilityMeta.publicationDate,
    });
  }
  return <Answer answers={answers} />;
}

function InteroperabilityContent({
  data,
}: Readonly<{ data: DocumentationData<"2"> }>) {
  if (!data.euInteroperabilityOutcome?.outcomeId) return null;
  const outcome =
    data.euInteroperabilityOutcome?.outcomeId === "REQUIRED" ? "Ja" : "Nein";
  return (
    <Answer
      answers={[
        {
          prefix: "Ergab die Vorprüfung Bezug zur EU-Interoperabilität?",
          answer: outcome,
        },
      ]}
    />
  );
}

function BindingRequirementSummary({
  bindingRequirements,
}: Readonly<{ bindingRequirements?: BindingRequirementsData }>) {
  if (!bindingRequirements) return null;
  return bindingRequirements.requirements.map((bindingRequirement, index) => {
    return (
      <>
        {index > 0 && <hr className="text-kern-layout-text-muted" />}
        <div key={bindingRequirement.description}>
          <RequirementDetail requirement={bindingRequirement} />
        </div>
      </>
    );
  });
}

function createInteroperabilityInfoBoxItems(
  documentationData: DocumentationData<"2">,
): InfoBoxProps[] {
  const detailsRequired =
    documentationData.euInteroperabilityOutcome?.outcomeId === "REQUIRED";

  const assessmentItems = [
    {
      heading: "Rechtliche Bewertung",
      route: dokumentation_bewertungRechtlich,
      ratingTitle:
        "Schafft das Regelungsvorhaben die rechtlichen Voraussetzungen für einen Datenaustausch innerhalb der EU?",
      rating: documentationData.interoperabilityAssessment?.legal?.rating,
      detail: documentationData.interoperabilityAssessment?.legal?.detail,
    },
    {
      heading: "Organisatorische Bewertung",
      route: dokumentation_bewertungOrganisatorisch,
      ratingTitle:
        "Schafft das Regelungsvorhaben die organisatorischen Voraussetzungen für einen Datenaustausch innerhalb der EU?",
      rating:
        documentationData.interoperabilityAssessment?.organizational?.rating,
      detail:
        documentationData.interoperabilityAssessment?.organizational?.detail,
    },
    {
      heading: "Semantische Bewertung",
      route: dokumentation_bewertungSemantisch,
      ratingTitle:
        "Stellt das Regelungsvorhaben sicher, dass semantische Definitionen von Begriffen und Datenfeldern den Datenaustausch über EU-Grenzen ermöglichen?",
      rating: documentationData.interoperabilityAssessment?.semantic?.rating,
      detail: documentationData.interoperabilityAssessment?.semantic?.detail,
    },
    {
      heading: "Technische Bewertung",
      route: dokumentation_bewertungTechnisch,
      ratingTitle:
        "Schafft das Regelungsvorhaben die technischen Voraussetzungen für einen Datenaustausch innerhalb der EU?",
      rating: documentationData.interoperabilityAssessment?.technical?.rating,
      detail: documentationData.interoperabilityAssessment?.technical?.detail,
    },
  ] as const;

  return [
    createInfoBoxItem({
      heading: "EU-Interoperabilität",
      route: dokumentation_euInteroperabilitaetsbezug,
      content: <InteroperabilityContent data={documentationData} />,
    }),
    detailsRequired &&
      createInfoBoxItem({
        heading: "Verbindliche Anforderungen",
        route: dokumentation_verbindlicheAnforderungen,
        content: (
          <BindingRequirementSummary
            bindingRequirements={documentationData.bindingRequirements}
          />
        ),
      }),
    ...(detailsRequired
      ? assessmentItems.map(({ heading, route, ratingTitle, rating, detail }) =>
          createInfoBoxItem({
            heading,
            route,
            content: (
              <Answer
                answers={[
                  {
                    prefix: ratingTitle,
                    answer: formatRating(rating),
                  },
                  {
                    prefix: "Begründung",
                    answer: detail,
                  },
                ]}
              />
            ),
          }),
        )
      : []),
    detailsRequired &&
      createInfoBoxItem({
        route: dokumentation_veroeffentlichung,
        content: documentationData.interoperabilityMeta ? (
          <InteroperabilityMetaContent
            interoperabilityMeta={documentationData.interoperabilityMeta}
          />
        ) : null,
      }),
  ].filter(Boolean) as InfoBoxProps[];
}

export function DocumentationSummary() {
  const { routes, previousUrl, nextUrl, prinzips } =
    useDocumentationNavigation();
  const { documentationData } = useDocumentationDataService();

  const items: InfoBoxProps[] = [
    createInfoBoxItem({
      heading: "Informationen zum Regelungsvorhaben",
      route: dokumentation_regelungsvorhabenTitel,
      content: documentationData.policyTitle?.title ? (
        <PolicyTitleContent policyTitle={documentationData.policyTitle} />
      ) : null,
    }),
    createInfoBoxItem({
      route: dokumentation_beteiligungsformate,
      content:
        documentationData.participation &&
        (documentationData.participation.formats ||
          documentationData.participation.results) ? (
          <ParticipationContent
            participation={documentationData.participation}
          />
        ) : null,
    }),
    ...prinzips.map((prinzip) => {
      const principleRoute = routes
        .flatMap((route) => ("routes" in route ? route.routes : route))
        .find((route) => route.path.endsWith(prinzip.URLBezeichnung));
      if (!principleRoute)
        throw new Error(
          `Cannot find route for principle ${prinzip.URLBezeichnung}`,
        );
      const principleFormData = documentationData.principles?.find(
        (principle) => principle.id === prinzip.documentId,
      ) as Principle;
      const editRoute = principleFormData?.answer
        ? { ...principleRoute, path: `${principleRoute.path}/erlaeuterung` }
        : principleRoute;
      return createInfoBoxItem({
        route: editRoute,
        content: principleFormData?.answer ? (
          <PrincipleContent principle={principleFormData} prinzip={prinzip} />
        ) : null,
        badge: {
          text: `Prinzip ${prinzip.order}`,
          principleNumber: prinzip.Nummer as PrincipleNumber,
        },
      });
    }),
    ...createInteroperabilityInfoBoxItems(documentationData),
  ];

  return (
    <>
      <Heading
        text={summary.headline}
        tagName="h1"
        look="kern-heading-large"
        className="mb-16"
      />
      <RichText markdown={summary.text} />
      <InfoBoxList className="space-y-40">
        {items.map((item, i) => (
          <InfoBox key={item.identifier ?? i} {...item} />
        ))}
      </InfoBoxList>
      <DocumentationActions previousUrl={previousUrl} nextUrl={nextUrl} />
    </>
  );
}
