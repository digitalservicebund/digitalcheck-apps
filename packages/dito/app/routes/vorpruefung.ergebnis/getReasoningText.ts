import { preCheck } from "resources/content";

const { questions } = preCheck;

export default function getReasoningText(
  questionIds: string[],
  intro: string,
  resultType: "positiveResult" | "negativeResult" | "question",
) {
  return `${intro}\n${questionIds
    .map((qId) => `- ${questions.find((q) => q.id === qId)?.[resultType]}`)
    .join("\n")}`;
}
