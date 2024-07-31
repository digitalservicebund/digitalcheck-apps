import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div
      aria-live="assertive"
      id={id}
      data-testid="inputError"
      className="mt-16 text-red-800 flex items-center gap-x-4"
    >
      <div className="flex-shrink-0">
        <ErrorOutline className="!w-18 !h-18 fill-red-800" />
      </div>
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
