import twMerge from "~/utils/tailwindMerge";
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
      className={twMerge(
        "flex flex-wrap gap-16",
        reverseOrder && "flex-wrap-reverse",
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
