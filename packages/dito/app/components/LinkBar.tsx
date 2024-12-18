import { Link } from "@remix-run/react";

const LinkBar = <T extends { url: string }>({
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
    <div className="flex justify-center space-x-8 mt-20">
      {elements.map((element, index) => (
        <Link
          key={element.url}
          to={element.url}
          className={`h-6 flex-1 transition-all duration-300 ${
            index <= currentIndex ? "bg-blue-800" : "bg-blue-300"
          }`}
        />
      ))}
    </div>
  );
};

export default LinkBar;
