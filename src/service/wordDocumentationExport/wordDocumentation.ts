import { templateDokumentationDerDigitaltauglichkeitInteroperabilitaet_docx } from "@/config/downloads";
import type { Prinzip } from "@/content.config";
import { useDocumentationDataService } from "@/pages/dokumentation/_react/DocumentationDataProvider";
import type { DocumentationData } from "@/pages/dokumentation/_react/documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "@/pages/dokumentation/_react/documentationDataSchema";
import {
  euInteroperabilityQuestion,
  formatRating,
  interoperabilityRatingPlaceholder,
} from "@/pages/dokumentation/_react/interoperability/values.ts";
import { documentationDocument } from "@/resources/content/documentation-document";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { contact } from "@/resources/content/shared/contact";
import {
  toMailtoHyperlinkPatch,
  toParagraphPatch,
} from "@/service/wordDocumentationExport/docxUtils.ts";
import { formatBindingRequirements } from "@/service/wordDocumentationExport/wordInteroperabilityAssessment.ts";
import { slugify } from "@/utils/utilFunctions";
import type { IPatch } from "docx";
import { convertInchesToTwip, patchDocument, PatchType } from "docx";
import fileSaver from "file-saver";
import { useCallback } from "react";
import markdownBlocksToDocx from "./markdownBlocksToWord";

const { saveAs } = fileSaver;
const { principlePages } = digitalDocumentation;

export function useWordDocumentation() {
  const { documentationData } = useDocumentationDataService();

  const downloadDocumentation = useCallback(
    async (
      prinzips: Prinzip[],
      { templateOnly = false }: { templateOnly?: boolean } = {},
    ) => {
      try {
        const template = await fetch(
          templateDokumentationDerDigitaltauglichkeitInteroperabilitaet_docx.path,
        );
        const templateData = await template.arrayBuffer();
        const doc = await createDoc(
          templateData,
          templateOnly ? { version: DATA_SCHEMA_VERSION } : documentationData,
          prinzips,
          { templateOnly },
        );
        saveAs(doc, documentationDocument.filename);
      } catch (e) {
        console.error(e);
      }
    },
    [documentationData],
  );

  return { downloadDocumentation };
}

function getInteroperabilityOutcomeValue(documentationData: DocumentationData) {
  const outcomeId = documentationData.euInteroperabilityOutcome?.outcomeId;

  const placeholder = euInteroperabilityQuestion.options
    .map((option) => option.label)
    .join(" / ");

  return (
    (outcomeId &&
      euInteroperabilityQuestion.options.find(
        (option) => option.value === outcomeId,
      )?.label) ??
    placeholder
  );
}

export const createDoc = async (
  templateData: ArrayBuffer | Uint8Array,
  documentationData: DocumentationData,
  prinzips: Prinzip[],
  { templateOnly }: { templateOnly?: boolean },
) => {
  const {
    policyTitle,
    participation,
    principles: principleAnswers,
  } = documentationData;
  const date = new Date().toLocaleDateString("de-DE");

  return patchDocument({
    data: templateData,
    outputType: "blob",
    patches: {
      TEMPLATE_TYPE: toParagraphPatch(
        templateOnly ? "Word-Dokumentation" : "Online-Dokumentation",
      ),
      TIMESTAMP: toParagraphPatch(date),
      NKR_CONTACT_EMAIL: toMailtoHyperlinkPatch(contact.nkrEmail),
      INTEROPS_EMAIL: toMailtoHyperlinkPatch(contact.interoperabilityEmail),
      DS_EMAIL: toMailtoHyperlinkPatch(contact.email),
      DS_PHONE: toParagraphPatch(contact.phoneDisplay),
      POLICY_TITLE: toParagraphPatch(answerOrPlaceholder(policyTitle?.title)),
      POLICY_ORGANIZATION: toParagraphPatch(
        answerOrPlaceholder(policyTitle?.organization),
      ),
      PARTICIPATION_FORMATS: toParagraphPatch(
        answerOrPlaceholder(participation?.formats),
      ),
      PARTICIPATION_RESULTS: toParagraphPatch(
        answerOrPlaceholder(participation?.results),
      ),
      ...buildPrinciplePatches(prinzips, principleAnswers),
      INTEROPERABILITY_OUTCOME: toParagraphPatch(
        getInteroperabilityOutcomeValue(documentationData),
      ),
      BINDING_REQUIREMENTS_TABLE: {
        type: PatchType.DOCUMENT,
        children: formatBindingRequirements(
          documentationData.bindingRequirements,
        ),
      },
      IO_LEGAL_RATING: toParagraphPatch(
        formatRating(
          documentationData.interoperabilityAssessment?.legal?.rating,
        ) ?? interoperabilityRatingPlaceholder,
      ),
      IO_LEGAL_DETAIL: toParagraphPatch(
        answerOrPlaceholder(
          documentationData.interoperabilityAssessment?.legal?.detail,
        ),
      ),
      IO_ORGANIZATIONAL_RATING: toParagraphPatch(
        formatRating(
          documentationData.interoperabilityAssessment?.organizational?.rating,
        ) ?? interoperabilityRatingPlaceholder,
      ),
      IO_ORGANIZATIONAL_DETAIL: toParagraphPatch(
        answerOrPlaceholder(
          documentationData.interoperabilityAssessment?.organizational?.detail,
        ),
      ),
      IO_SEMANTIC_RATING: toParagraphPatch(
        formatRating(
          documentationData.interoperabilityAssessment?.semantic?.rating,
        ) ?? interoperabilityRatingPlaceholder,
      ),
      IO_SEMANTIC_DETAIL: toParagraphPatch(
        answerOrPlaceholder(
          documentationData.interoperabilityAssessment?.semantic?.detail,
        ),
      ),
      IO_TECHNICAL_RATING: toParagraphPatch(
        formatRating(
          documentationData.interoperabilityAssessment?.technical?.rating,
        ) ?? interoperabilityRatingPlaceholder,
      ),
      IO_TECHNICAL_DETAIL: toParagraphPatch(
        answerOrPlaceholder(
          documentationData.interoperabilityAssessment?.technical?.detail,
        ),
      ),
      PUBLICATION_DATE: toParagraphPatch(
        documentationData.interoperabilityMeta?.publicationDate ||
          "Eine ungefähre Angabe (Monat) ist ausreichend.",
      ),
      PUBLICATION_LINK: toParagraphPatch(
        documentationData.interoperabilityMeta?.publicationLink ||
          "Link zum Referentenentwurf hier einfügen.",
      ),
    },
  });
};

const answerOrPlaceholder = (answer?: string) =>
  answer || documentationDocument.placeholder;

const answerOrPlaceholderOptional = (answer?: string) =>
  answer || documentationDocument.placeholderOptional;

// Builds all patches that are needed for the principles
// - Title
// - Description
// - Answer for the principle
// - Reasoning (in case of a negative answer)
// - Aspects and own explanation (partially filled in case of a positive answer)
export const buildPrinciplePatches = (
  prinzips: Prinzip[],
  answers: DocumentationData["principles"],
): Record<string, IPatch> =>
  prinzips.reduce((acc, prinzip, prinzipIndex) => {
    const answer = answers?.find((answer) => answer.id === prinzip.documentId);
    const hasPositivePrincipleAnswer = answer?.answer?.includes("Ja");

    // Build the aspects content from the Content Collection and user answers (if positive)
    const aspectsContent = prinzip.Aspekte.flatMap((aspekt) => {
      // Find the reasoning entry where the aspect matches
      const matchingReasoning = Array.isArray(answer?.aspects)
        ? answer?.aspects?.find(
            (aspect) => aspect === slugify(aspekt.Kurzbezeichnung),
          )
        : undefined;

      return hasPositivePrincipleAnswer && matchingReasoning
        ? aspekt.Kurzbezeichnung
        : undefined;
    }).filter(Boolean);

    return {
      ...acc,
      [`PRINCIPLE_${prinzipIndex + 1}_TITLE`]: toParagraphPatch(prinzip.Name),
      [`PRINCIPLE_${prinzipIndex + 1}_DESCRIPTION`]: {
        type: PatchType.DOCUMENT,
        children: markdownBlocksToDocx(prinzip.Hilfetext),
      },
      [`PRINCIPLE_${prinzipIndex + 1}_ANSWER`]: toParagraphPatch(
        answer?.answer ?? principlePages.radioOptions.join(" | "),
      ),
      // We always need to fill both patches to avoid the tags rendering
      [`PRINCIPLE_${prinzipIndex + 1}_REASONING`]: toParagraphPatch(
        answerOrPlaceholderOptional(answer?.reasoning),
      ),
      [`PRINCIPLE_${prinzipIndex + 1}_ASPECTS`]: toParagraphPatch(
        hasPositivePrincipleAnswer
          ? aspectsContent.join(", ")
          : documentationDocument.placeholderOptional,
      ),
      [`PRINCIPLE_${prinzipIndex + 1}_ASPECTS_AVAILABLE`]: toParagraphPatch(
        prinzip.Aspekte.map((aspekt) => aspekt.Kurzbezeichnung).join(", "),
      ),
    };
  }, {});

export const indentOptions = {
  indent: {
    left: convertInchesToTwip(0.5),
  },
};
