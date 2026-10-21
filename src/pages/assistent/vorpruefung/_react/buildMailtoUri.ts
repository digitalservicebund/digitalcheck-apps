import type { ResultContent } from "@/pages/assistent/vorpruefung/_react/getContentForResult";
import { preCheckResult } from "@/resources/content/vorpruefung-ergebnis";
import type { PreCheckResult } from "./PreCheckResult";
import { ResultType } from "./PreCheckResult";

const { emailTemplate } = preCheckResult.form;

function resolveRecipients(result?: PreCheckResult) {
  const additionalRecipient =
    result?.interoperability === ResultType.NEGATIVE
      ? ""
      : `; ${emailTemplate.toDC}`;
  return `${emailTemplate.toNkr}${additionalRecipient}`;
}

export function buildEmailBody(
  resultContent: ResultContent,
  negativeReasoning?: string,
  vorhabenTitle?: string,
) {
  let resultText: string = vorhabenTitle
    ? `Betreff des Vorhabens: ${vorhabenTitle}\n\n---\n\n`
    : "";

  resultText += `${resultContent.title}\n\n\n`;

  resultContent.reasoningList
    .filter((reasoning) => reasoning.reasons.length !== 0)
    .forEach(({ intro, reasons }) => {
      resultText += `➤ ${intro} \n\n`;
      reasons
        .toSorted((a, b) => {
          if (a.answer === b.answer) {
            return 0; // Keep the original order fixes hydration mismatch
          }
          return a.answer === "yes" ? -1 : 1; // "yes" comes before "no"
        })
        .forEach((reason) => {
          resultText += reason.answer === "yes" ? "+" : "";
          resultText += reason.answer === "no" ? "-" : "";
          resultText += reason.answer === "unsure" ? "?" : "";
          resultText += ` ${reason.text}\n`;
          resultText += reason.hint ? `${reason.hint}\n` : "";
        });
      resultText += "\n\n";
    });

  resultText = resultText.replaceAll("**", "");
  resultText += negativeReasoning
    ? `${preCheckResult.form.reasonLabel}:\n\n${negativeReasoning}\n\n`
    : "";

  return `${emailTemplate.bodyBefore}\n${resultText}\n\n${emailTemplate.bodyAfter}`;
}

export function buildMailtoUri(
  result: PreCheckResult | undefined,
  resultContent: ResultContent,
  vorhabenTitle: string,
  negativeReasoning?: string,
) {
  const subject = `${emailTemplate.subject}: „${vorhabenTitle}“`;
  const recipients = encodeURIComponent(resolveRecipients(result));
  const body = buildEmailBody(resultContent, negativeReasoning);

  return `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
