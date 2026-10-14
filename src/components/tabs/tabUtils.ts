export function getSelectedIndexByKey<T extends { key: string }>(
  items: T[],
  activeKey?: string,
) {
  if (items.length === 0) {
    return 0;
  }

  const selectedIndex = items.findIndex((item) => item.key === activeKey);
  return selectedIndex === -1 ? 0 : selectedIndex;
}

export const desktopTabClassName =
  "relative -mb-[3px] box-border min-h-[70px] cursor-pointer border-b-[3px] border-blue-500 px-24 py-12 text-left leading-tight hyphens-auto text-blue-800 hover:bg-blue-100";

export const selectedDesktopTabClassName =
  "border-b-4 border-blue-800 bg-blue-100 font-bold";

export const mobileTabPickerOptionsClassName =
  "border-t border-blue-500 focus:outline-none";

export const mobileTabPickerOptionClassName =
  "relative cursor-pointer border-4 border-transparent py-[10px] pr-[10px] pl-[16px] text-blue-800 select-none first:pt-[16px] last:pb-[16px] focus:border-blue-800";

export const mobileTabPickerButtonClassName =
  "relative h-[70px] w-full cursor-pointer border-4 border-transparent bg-blue-100 pl-[16px] text-left text-blue-800 hover:bg-blue-300 focus:border-blue-800";
