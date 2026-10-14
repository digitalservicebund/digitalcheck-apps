import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type FeatureListProps = {
  children: ReactNode;
  className?: string;
};

export const FeatureList = ({
  children,
  className,
}: Readonly<FeatureListProps>) => {
  return (
    <ul
      className={twMerge(
        "list-unstyled grid max-w-[848px] auto-cols-fr gap-40 md:grid-flow-col md:gap-y-16",
        className,
      )}
    >
      {children}
    </ul>
  );
};

export type FeatureProps = {
  children: ReactNode;
};

export const Feature = ({ children }: Readonly<FeatureProps>) => {
  return (
    <li className="flex flex-col gap-y-8 md:row-span-3 md:grid md:grid-rows-subgrid">
      {children}
    </li>
  );
};
