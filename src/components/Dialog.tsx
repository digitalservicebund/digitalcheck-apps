import {
  Description,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { useState } from "react";

type DialogProps = {
  title: string;
  description?: string;
  children: ReactNode;
  renderToggleButton?: (args: { toggleDialog: () => void }) => ReactNode;
  renderActionButtons?: (args: { closeDialog: () => void }) => ReactNode;
  open?: boolean;
  onToggle?: (value: boolean) => void;
};

function Dialog({
  children,
  renderToggleButton,
  title,
  description,
  renderActionButtons,
  open: parentControlledOpen,
  onToggle,
}: Readonly<DialogProps>) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = parentControlledOpen !== undefined;
  const isOpen = isControlled ? parentControlledOpen : internalOpen;

  const handleToggle = (newOpenState: boolean) => {
    onToggle?.(newOpenState);
    if (!isControlled) {
      setInternalOpen(newOpenState);
    }
  };

  return (
    <>
      {renderToggleButton?.({ toggleDialog: () => handleToggle(!isOpen) })}
      <HeadlessDialog
        open={isOpen}
        onClose={() => handleToggle(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/60 p-4">
          <DialogPanel className="max-w-a11y w-full space-y-16 bg-white p-40">
            <DialogTitle className="kern-heading-large">{title}</DialogTitle>
            {description && <Description>{description}</Description>}
            <div>{children}</div>
            {renderActionButtons ? (
              renderActionButtons({ closeDialog: () => handleToggle(false) })
            ) : (
              <div className="flex gap-4">
                <button type="button" onClick={() => handleToggle(false)}>
                  Cancel
                </button>
                <button type="button" onClick={() => handleToggle(false)}>
                  Deactivate
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </HeadlessDialog>
    </>
  );
}

export default Dialog;
