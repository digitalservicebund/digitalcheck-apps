import { preCheck } from "~/resources/content";
import { type ResultContent } from "~/routes/vorpruefung.ergebnis/getContentForResult";
import { PreCheckResult, ResultType } from "./PreCheckResult";

const { emailTemplate } = preCheck.result.form;

function resolveRecipients(result: PreCheckResult) {
  const additionalRecipient =
    result.interoperability !== ResultType.NEGATIVE
      ? `; ${emailTemplate.toDC}`
      : "";
  return `${emailTemplate.toNkr}${additionalRecipient}`;
}

function buildEmailBody(
  resultContent: ResultContent,
  negativeReasoning?: string,
) {
  let resultText: string = `${resultContent.title}\n\n\n`;

  resultContent.reasoningList
    .filter((reasoning) => reasoning.reasons.length !== 0)
    .forEach(({ intro, reasons }) => {
      resultText += `➤ ${intro} \n\n`;
      reasons
        .sort((reason) => (reason.answer === "yes" ? -1 : 1))
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
    ? `${preCheck.result.form.reasonLabel}:\n\n${negativeReasoning}\n\n`
    : "";

  return `${emailTemplate.bodyBefore}\n${resultText}\n\n${emailTemplate.bodyAfter}`;
}

export default function buildMailtoRedirectUri(
  result: PreCheckResult,
  resultContent: ResultContent,
  policyTitle: string,
  userEmail?: string,
  negativeReasoning?: string,
) {
  const subject = `${emailTemplate.subject}: „${policyTitle}“`;
  const cc = userEmail ? `&cc=${userEmail}` : "";
  const recipients = encodeURIComponent(resolveRecipients(result));
  const body = buildEmailBody(resultContent, negativeReasoning);
  return `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc}`;
}
