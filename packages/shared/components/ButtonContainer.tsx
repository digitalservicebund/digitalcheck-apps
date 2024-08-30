import classNames from "classnames";
import Button, { type ButtonLinkProps, type ButtonProps } from "./Button";

type ButtonContainerProps = {
  reverseOrder?: boolean;
  className?: string;
  buttons: (ButtonLinkProps | ButtonProps)[];
};

const ButtonContainer = ({
  buttons,
  reverseOrder,
  className,
}: ButtonContainerProps) => {
  return (
    <div
      className={classNames(
        "flex flex-wrap gap-16",
        {
          "flex-wrap-reverse": reverseOrder,
        },
        className,
      )}
    >
      {buttons.map((button) => (
        <Button key={button.text ?? button.href} {...button} />
      ))}
    </div>
  );
};

export default ButtonContainer;
