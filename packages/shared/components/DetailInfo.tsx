import classNames from "classnames";

type DetailInfoProps = {
  label?: string[];
  value?: string;
  isSelectable?: boolean;
  selectOptions?: string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Add onChange prop
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: "default" | "highlight";
};

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "0";
const BACKGROUND_COLORS = {
  default: "bg-gray-100",
  highlight: "bg-red-100",
};

export default function DetailInfo({
  label,
  value,
  isSelectable = false,
  selectOptions = [],
  onChange,
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
}: DetailInfoProps) {
  const cssClasses = classNames(
    BACKGROUND_COLORS[backgroundColor],
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom}`,
    "inline-flex items-center space-x-2 p-2 rounded",
  );

  return (
    <div className={cssClasses}>
      {label && label.length > 0 && (
        <span>
          {label.map((text, index) => (
            <span key={index} className="mr-12">
              {text}
            </span>
          ))}
        </span>
      )}
      {isSelectable ? (
        <select
          className="w-full p-1 border border-gray-300 rounded bg-gray-100"
          onChange={onChange} // Pass the onChange prop to the <select> element
        >
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
