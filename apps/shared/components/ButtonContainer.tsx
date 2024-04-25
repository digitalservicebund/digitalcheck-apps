import classNames from "classnames";
import type { PropsWithChildren } from "react";

type ButtonContainerProps = PropsWithChildren & {
  reverseOrder?: boolean;
};

const ButtonContainer = ({ children, reverseOrder }: ButtonContainerProps) => {
  return (
    <div
      className={classNames("flex flex-wrap gap-24", {
        "flex-wrap-reverse": reverseOrder,
      })}
    >
      {children}
    </div>
  );
};

export default ButtonContainer;
