import classNames from "classnames";
import Button, { ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import ButtonLink, { ButtonLinkProps } from "./ButtonLink.tsx";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type BoxProps = {
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
        additionalClassNames ?? "",
        "ds-stack-16 scroll-my-40",
      )}
      id={identifier}
    >
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {content && <RichText {...content} />}
      </div>
      {buttons && buttons.length > 0 && (
        <ButtonContainer>
          {buttons.map((button) => {
            if ("href" in button) {
              return <ButtonLink key={button.text} {...button} />;
            } else if ("onClickCallback" in button) {
              return <Button key={button.text} {...button} />;
            } else {
              return null;
            }
          })}
        </ButtonContainer>
      )}
    </div>
  );
};

export default Box;
