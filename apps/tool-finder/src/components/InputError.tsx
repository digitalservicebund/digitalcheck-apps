import ErrorOutline from "@mui/icons-material/ErrorOutline";
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
      <ErrorOutline className="!w-18 !h-18" />
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
