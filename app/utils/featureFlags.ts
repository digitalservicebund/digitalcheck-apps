import { useOutletContext } from "@remix-run/react";

export const useFeatureFlag = (name: string) => {
  const { featureFlags } = useOutletContext<{
    featureFlags: Record<string, boolean>;
  }>();

  return featureFlags?.[name] || false;
};

export default useFeatureFlag;
