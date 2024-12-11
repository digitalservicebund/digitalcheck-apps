import classNames from "classnames";

function LabelWithIcon(content: {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  look?: "primary" | "secondary";
}) {
  const look = content.look || "primary";
  const iconClassNames = classNames("mb-2", {
    "h-12 w-12": look == "primary",
    "h-24 w-24": look == "secondary",
  });
  const labelClassNames = classNames({
    "label-03-bold text-blue-800 bg-blue-300 px-8 py-4 rounded text-sm normal-case":
      look == "secondary",
  });
  const wrapperClassNames = classNames({
    "gap-4": look == "primary",
    "gap-12": look == "secondary",
  });

  return (
    <div className={`flex items-center ${wrapperClassNames}`}>
      <content.icon className={`h-12 w-12 mb-2 ${iconClassNames}`} />
      <span className={`${labelClassNames}`}>{content.label}</span>
    </div>
  );
}

export default LabelWithIcon;
