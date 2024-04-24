import type { BackgroundColor } from ".";

type Padding =
  | "default"
  | "0" // !pt-0 !pb-0
  | "8" // !pt-8 !pb-8
  | "10" // !pt-10 !pb-10
  | "16" // !pt-16 !pb-16
  | "24" // !pt-24 !pb-24
  | "32" // !pt-32 !pb-32
  | "40" // !pt-40 !pb-40
  | "48" // !pt-48 !pb-48
  | "50" // !pt-50 !pb-50
  | "56" // !pt-56 !pb-56
  | "64" // !pt-64 !pb-64
  | "80"; // !pt-80 !pb-80

export type CommonWrapperProps = {
  backgroundColor?: BackgroundColor;
  paddingTop?: Padding;
  paddingBottom?: Padding;
};
