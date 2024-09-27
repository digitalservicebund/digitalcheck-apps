import classNames from "classnames";
import { ButtonLinkProps, ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

export type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  additionalClassNames?: string;
  buttons?: (ButtonLinkProps | ButtonProps)[];
};

const Box = ({
  identifier,
  label,
  heading,
  content,
  buttons,
  additionalClassNames,
}: BoxProps) => {
  return (
    <div
      className={classNames(
        "box",
        additionalClassNames ?? "",
        "ds-stack-16 scroll-my-40",
      )}
      id={identifier}
    >
      <div className="ds-stack-8">
        {label && (
          <Heading tagName="div" look="ds-label-section text-gray-900">
            {/* Visually styled label */}
            <span aria-hidden="true">{label.text || label.children}</span>
            {/* Accessible label for screen readers */}
            <span role="heading" aria-level={1} className="sr-only">
              {label.text || label.children}
            </span>
            {/* Render as children if provided */}
          </Heading>
        )}
        {heading && <Heading tagName="h2" {...heading} />}
        {content && <RichText {...content} />}
      </div>
      {buttons && buttons.length > 0 && <ButtonContainer buttons={buttons} />}
    </div>
  );
};

export default Box;
