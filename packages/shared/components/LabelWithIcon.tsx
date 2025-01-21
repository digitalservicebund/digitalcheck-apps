import { twJoin } from "tailwind-merge";

function LabelWithIcon(
  content: Readonly<{
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    look?: "primary" | "secondary";
  }>,
) {
  const look = content.look ?? "primary";
  const iconClassNames = twJoin(
    "mb-2",
    look == "primary" && "h-12 w-12",
    look == "secondary" && "h-24 w-24",
  );
  const labelClassNames = twJoin(
    look == "secondary" &&
      "label-03-bold text-blue-800 bg-blue-300 px-8 py-4 rounded text-sm normal-case",
  );
  const wrapperClassNames = twJoin(
    look == "primary" && "gap-4",
    look == "secondary" && "gap-12",
  );

  return (
    <div className={`flex items-center ${wrapperClassNames}`}>
      <content.icon className={`mb-2 size-12 ${iconClassNames}`} />
      <span className={`${labelClassNames}`}>{content.label}</span>
    </div>
  );
}

export default LabelWithIcon;
