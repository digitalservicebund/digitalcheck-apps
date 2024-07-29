import classNames from "classnames";
import Button, { ButtonLinkProps, ButtonProps } from "./Button";
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
            {label.text || label.children}{" "}
            {/* Render as children if provided */}
          </Heading>
        )}
        {heading && <Heading tagName="h2" {...heading} />}
        {content && <RichText {...content} />}
      </div>
      {buttons && buttons.length > 0 && (
        <ButtonContainer>
          {buttons.map((button) => (
            <Button key={button.text ?? button.href} {...button} />
          ))}
        </ButtonContainer>
      )}
    </div>
  );
};

export default Box;
