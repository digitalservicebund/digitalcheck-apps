import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import RadioButtonUncheckedOutlined from "@digitalservicebund/icons/RadioButtonUncheckedOutlined";
import { precheck } from "resources/content";
import type { Answers, TQuestion } from "./types";

type SideNavProps = {
  question: TQuestion;
  answers: Answers;
};

export function SideNav({ question, answers }: SideNavProps) {
  const firstUnansweredQuestionIdx = Object.keys(answers).length;
  const questions = precheck.questions;

  return (
    <nav className="pt-48 px-16">
      <ul className="space-y-16">
        {questions.map((q: TQuestion) => {
          const isAnswered = q.id in answers;
          const isSelected = q.id === question.id;
          // only answered questions and the first unanswered question are selectable
          const isSelectable =
            isAnswered || q.id === questions[firstUnansweredQuestionIdx]?.id;
          return (
            <li key={q.id} className="flex space-x-4">
              {isAnswered ? (
                <CheckCircleOutline className="fill-green-600" />
              ) : (
                <RadioButtonUncheckedOutlined
                  className={isSelectable ? "fill-gray-900" : "fill-gray-600"}
                />
              )}
              {
                // only link to answered questions or the first unanswered question
                isSelectable ? (
                  <a href={q.url} className={isSelected ? "font-semibold" : ""}>
                    {q.title}
                  </a>
                ) : (
                  <span className="text-gray-400">{q.title}</span>
                )
              }
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
