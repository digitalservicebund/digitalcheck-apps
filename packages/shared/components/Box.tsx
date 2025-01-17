import twMerge from "@digitalcheck/shared/utils/tailwindMerge";
import { useId } from "react";
import { ButtonLinkProps, ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

export type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  className?: string;
  buttons?: (ButtonLinkProps | ButtonProps)[];
};

const Box = ({
  identifier,
  label,
  heading,
  content,
  buttons,
  className,
}: BoxProps) => {
  const generatedId = useId();
  const headingId = heading?.id ?? generatedId;
  const labelId = `${headingId}-label`;
  return (
    <div
      className={twMerge("box ds-stack-16 scroll-my-40", className)}
      id={identifier}
    >
      <div className="ds-stack-8">
        {label && (
          <Heading
            tagName="div"
            look="ds-label-section text-gray-900"
            id={labelId}
          >
            <span>{label.text || label.children}</span>
          </Heading>
        )}
        {heading && (
          <Heading
            tagName="h2"
            id={headingId}
            {...heading}
            aria-labelledby={`${labelId} ${headingId}`}
          />
        )}
        {content && <RichText {...content} />}
      </div>
      {buttons && buttons.length > 0 && <ButtonContainer buttons={buttons} />}
    </div>
  );
};

export default Box;
