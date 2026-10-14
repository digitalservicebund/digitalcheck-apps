import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Heading from "./Heading";
import RichText from "./RichText";

type HeroProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  preline?: ReactNode;
  className?: string;
};

export default function Hero({
  children,
  title,
  subtitle,
  className,
}: Readonly<HeroProps>) {
  return (
    <section className={twMerge("bg-kern-darkblue-100 py-kern-4xl", className)}>
      <div className="kern-stack kern-stack-md container">
        <Heading tagName="h1">{title}</Heading>
        {subtitle && <RichText markdown={subtitle} className="mt-16" />}
        {children}
      </div>
    </section>
  );
}
