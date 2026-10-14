import { twMerge } from "tailwind-merge";

export type Look = "tabs" | "chips";

const tabVariants = {
  tabList: {
    tabs: "items-stretch box-border border-b-[3px] border-blue-500 max-lg:hidden",
    chips: "flex-wrap gap-16",
  },
  button: {
    tabs: "flex items-center -mb-[3px] box-border min-h-[70px] border-b-[3px] border-blue-500 px-24 leading-tight hyphens-auto hover:bg-blue-100 aria-selected:border-b-4 aria-selected:border-blue-800 aria-selected:bg-blue-100 aria-selected:font-bold",
    chips:
      "flex items-center rounded-full border border-gray-400 bg-white px-16 py-6 text-sm font-medium transition-colors hover:bg-blue-100 aria-selected:border-blue-400 aria-selected:bg-blue-400 aria-selected:font-bold aria-selected:hover:bg-blue-500",
  },
  mobilePicker: {
    tabs: "mb-40 lg:hidden",
    chips: null,
  },
} as const;

export const getTabClasses = (look: Look) => ({
  tabListClass: twMerge("mb-40 flex", tabVariants.tabList[look]),
  mobilePickerClass: tabVariants.mobilePicker[look],
  buttonClass: twMerge(
    "cursor-pointer text-blue-800 link-unstyled",
    tabVariants.button[look],
  ),
});
