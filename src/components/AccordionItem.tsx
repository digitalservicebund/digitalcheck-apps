import RichText from "@/components/RichText";
import { Add, Remove } from "@digitalservicebund/icons";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type AccordionItemProps = {
  headline: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
};

/*
 * An expandable accordion item with top and bottom borders, used to build
 * FAQ lists.
 * */
export default function AccordionItem({
  headline,
  children,
  id,
  className,
}: Readonly<AccordionItemProps>) {
  return (
    <div className={twMerge("border-b-2 border-blue-400", className)}>
      <Disclosure>
        <DisclosureButton
          className="group flex w-full items-center justify-between p-24 hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-4 focus-visible:outline-blue-800 data-open:bg-blue-200"
          id={id}
        >
          <div className="pr-10 text-left font-bold text-blue-800">
            {headline}
          </div>
          <Add className="size-24 shrink-0 fill-blue-800 group-data-open:hidden" />
          <Remove className="hidden size-24 shrink-0 fill-blue-800 group-data-open:block" />
        </DisclosureButton>
        <DisclosurePanel className="flex w-full items-center justify-between p-24">
          {typeof children === "string" ? (
            <RichText markdown={children} className="space-y-28" />
          ) : (
            children
          )}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
