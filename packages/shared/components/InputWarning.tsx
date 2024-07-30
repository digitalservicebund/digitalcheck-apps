import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputWarningProps = PropsWithChildren<{
  id: string;
}>;

const InputWarning = ({ id, children }: InputWarningProps) => {
  return (
    <div
      aria-live="assertive"
      id={id}
      data-testid="inputError"
      className="mt-16 text-red-800 flex items-center gap-x-4"
    >
      <ErrorOutline className="!w-18 !h-18 fill-yellow-800" />
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputWarning;
