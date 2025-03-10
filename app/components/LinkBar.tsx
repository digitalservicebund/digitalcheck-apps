import { Link } from "react-router";
import { twJoin } from "tailwind-merge";

const LinkBar = <T extends { url: string; title: string }>({
  elements,
  currentElement,
}: {
  elements: T[];
  currentElement: T;
}) => {
  const currentIndex = elements.findIndex(
    (element) => element.url === currentElement.url,
  );

  return (
    <div className="mt-20 flex justify-center space-x-8">
      {elements.map((element, index) => (
        <Link
          key={element.url}
          to={element.url}
          aria-label={element.title}
          className={twJoin(
            "h-6 flex-1 transition-all duration-300",
            index <= currentIndex ? "bg-blue-800" : "bg-blue-300",
          )}
        />
      ))}
    </div>
  );
};

export default LinkBar;
