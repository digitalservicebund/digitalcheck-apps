import Check from "@digitalservicebund/icons/Check";
import { Link } from "@remix-run/react";
import classNames from "classnames";
import { useId } from "react";
import { preCheck } from "resources/content";
import type {
  PreCheckAnswers,
  TQuestion,
} from "routes/vorpruefung.$questionId/route";

type PreCheckNavigationProps = Readonly<{
  question?: TQuestion;
  answers: PreCheckAnswers;
}>;

export default function PreCheckNavigation({
  question,
  answers,
}: PreCheckNavigationProps) {
  const firstUnansweredQuestionIdx = Object.keys(answers).length;
  const questions = preCheck.questions;

  return (
    <nav aria-label="Alle Fragen" className="precheck-navigation">
      <ul className="pl-0">
        {questions.map((q: TQuestion, idx) => {
          const isDone = q.id in answers;
          const isCurrent = q.id === question?.id;
          const isDisabled = idx > firstUnansweredQuestionIdx;
          return (
            <NavItem
              key={q.id}
              url={q.url}
              label={q.title}
              isCurrent={isCurrent}
              isDone={isDone}
              isDisabled={isDisabled}
            />
          );
        })}
      </ul>
    </nav>
  );
}

export type NavItem = {
  url: string;
  label: string;
  isDisabled: boolean;
  isCurrent: boolean;
  isDone: boolean;
};

function NavItem({
  url,
  label,
  isDisabled,
  isCurrent,
  isDone,
}: Readonly<NavItem>) {
  const liClassNames = classNames(
    "list-none border-b-[1px] border-b-white border-l-[4px]",
    {
      "text-gray-800 pointer-events-none": isDisabled,
      "border-l-blue-800 pointer-events-none": isCurrent,
      "border-l-blue-100": !isCurrent,
    },
  );

  // Transparent left borders to avoid layout shifts
  const itemClassNames = classNames(
    "bg-blue-100 w-full ds-label-02-reg p-16 flex gap-x-4 items-center hover:underline hover:bg-blue-300 active:bg-white focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-800",
    {
      "ds-label-02-bold bg-blue-400": isCurrent,
    },
  );
  const iconId = useId();

  return (
    <li className={liClassNames}>
      <Link
        to={url}
        className={itemClassNames}
        aria-disabled={isDisabled || isCurrent}
        aria-current={isCurrent}
        aria-describedby={iconId}
      >
        {isDone && <Check id={iconId} className="shrink-0" />}
        <span title={label}>{label}</span>
      </Link>
    </li>
  );
}
