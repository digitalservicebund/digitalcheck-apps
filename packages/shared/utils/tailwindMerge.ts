import tailwindPreset from "@digitalservice4germany/style-dictionary/tailwind";
import { extendTailwindMerge } from "tailwind-merge";

const spacing = Object.keys(tailwindPreset.theme.spacing);
const typographyVariants = [
  "01-reg",
  "01-bold",
  "02-reg",
  "02-bold",
  "03-reg",
  "03-bold",
];

const customTwMerge = extendTailwindMerge<
  | "dsButtonSize"
  | "dsButtonColor"
  | "dsCheckbox"
  | "dsInput"
  | "dsRadio"
  | "dsSelect"
  | "dsStack"
  | "dsTypography"
>({
  extend: {
    classGroups: {
      dsButtonSize: [{ "ds-button": ["small", "large"] }],
      dsButtonColor: [{ "ds-button": ["secondary", "tertiary", "ghost"] }],
      dsCheckbox: [{ "ds-checkbox": ["small", "mini"] }],
      dsInput: [{ "ds-input": ["medium", "small"] }],
      dsRadio: [{ "ds-radio": ["small", "mini"] }],
      dsSelect: [{ "ds-input": ["medium", "small"] }],
      dsStack: [{ "ds-stack": spacing }],
      dsTypography: [
        "ds-title-reg",
        { "ds-heading": typographyVariants },
        "ds-subhead",
        { "ds-label": typographyVariants },
        "ds-label-section",
        { "ds-body": typographyVariants },
        { "ds-link": typographyVariants },
      ],
    },
  },
});

export default customTwMerge;
