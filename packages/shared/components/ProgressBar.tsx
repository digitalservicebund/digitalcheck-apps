type ProgressBarProps<T> = {
  totalElements: number;
  currentElementIndex: number;
  elements: T[];
  onElementClick: (index: number, element: T) => void; // Callback for custom handling of clicks
};

const ProgressBar = <T,>({
  totalElements,
  currentElementIndex,
  elements,
  onElementClick,
}: ProgressBarProps<T>) => {
  const handleClick = (index: number) => {
    const element = elements[index];
    onElementClick(index, element);
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      handleClick(index);
    }
  };

  return (
    <div className="flex justify-center space-x-8 mt-20">
      {Array.from({ length: totalElements }, (_, index) => (
        <div
          key={index}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (index <= currentElementIndex) {
              handleClick(index);
            }
          }}
          onKeyDown={(e) => {
            if (index <= currentElementIndex) {
              handleKeyDown(index, e);
            }
          }}
          className={`h-6 flex-1 ${
            index == currentElementIndex ? "bg-blue-800" : "bg-blue-300"
          } transition-all duration-300`}
          style={{ maxWidth: "20%" }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
