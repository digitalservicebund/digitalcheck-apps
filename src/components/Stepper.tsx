import { twJoin } from "tailwind-merge";

const Stepper = <T extends { path: string; title: string }>({
  elements,
  currentElementUrl,
  firstUnansweredQuestionIndex,
  className,
}: {
  elements: T[];
  currentElementUrl: string;
  firstUnansweredQuestionIndex?: number;
  className?: string;
}) => {
  const currentIndex = elements.findIndex(
    (element) => element.path === currentElementUrl,
  );

  return (
    <nav
      className={twJoin("flex justify-center space-x-8", className)}
      data-testid="stepper"
    >
      {elements.map((el, index) => {
        const isReachable =
          index <= (firstUnansweredQuestionIndex ?? currentIndex);

        if (!isReachable)
          return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              role="link"
              key={el.path}
              aria-disabled="true"
              className="link-unstyled bg-kern-darkblue-100 h-6 flex-1 transition-all duration-300"
            >
              <span className="sr-only">{el.title}</span>
            </a>
          );
        return (
          <a
            key={el.path}
            href={el.path}
            className={twJoin(
              "link-unstyled h-6 flex-1 transition-all duration-300",
              index <= currentIndex
                ? "bg-kern-darkblue-800"
                : "bg-kern-darkblue-300",
            )}
          >
            <span className="sr-only">{el.title}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default Stepper;
