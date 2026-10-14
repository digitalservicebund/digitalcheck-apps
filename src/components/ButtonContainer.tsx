import type React from "react";
import { twMerge } from "tailwind-merge";

type ButtonContainerProps = {
  className?: string;
  children?: React.ReactNode;
};

const ButtonContainer = ({ className, children }: ButtonContainerProps) => {
  return (
    <div className={twMerge("flex flex-wrap gap-16", className)}>
      {children}
    </div>
  );
};

export default ButtonContainer;
