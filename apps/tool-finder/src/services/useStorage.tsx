import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useStorage<Type>(
  key: string,
  defaultValue: Type,
): [Type, Dispatch<SetStateAction<Type>>] {
  const [data, setData]: [Type, Dispatch<SetStateAction<Type>>] =
    useState<Type>(getValueFromStorage() ?? defaultValue);

  function getValueFromStorage(): Type | null {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData];
}
