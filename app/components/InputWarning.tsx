import WarningOutlined from "@digitalservicebund/icons/WarningAmberOutlined";
import type { PropsWithChildren } from "react";

type InputWarningProps = PropsWithChildren<{
  id: string;
}>;

const InputWarning = ({ id, children }: InputWarningProps) => {
  return (
    <div
      aria-live="assertive"
      id={id}
      data-testid="inputWarning"
      className="mt-16 flex items-center gap-x-4"
    >
      <div className="shrink-0">
        <WarningOutlined className="fill-yellow-800" />
      </div>
      <span className="sr-only">Warnung:</span> {children}
    </div>
  );
};

export default InputWarning;
