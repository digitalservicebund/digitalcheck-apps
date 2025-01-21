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
      data-testid={id}
      className="mt-16 flex items-center gap-x-4 text-red-800"
    >
      <div className="shrink-0">
        <ErrorOutline className="fill-red-800" />
      </div>
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
