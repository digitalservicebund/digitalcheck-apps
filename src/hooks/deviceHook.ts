import { useEffect, useRef, useState } from "react";

export function useResize(onResize: () => void, init = true) {
  const onResizeRef = useRef(onResize);

  // Update the ref when the callback changes
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const handleResize = () => {
      onResizeRef.current();
    };

    globalThis.window.addEventListener("resize", handleResize);
    if (init) handleResize(); // initialize

    return () => globalThis.window.removeEventListener("resize", handleResize);
  }, [init]);
}

export function useIsMobileSize() {
  // Start with undefined to indicate we don't know the size yet (avoiding hydration mismatch)
  // On the server, we can't determine the screen size, so we defer this until client-side
  const [isMobileSize, setIsMobileSize] = useState<boolean | undefined>(
    undefined,
  );

  useResize(() => {
    if (globalThis.window !== undefined) {
      setIsMobileSize(globalThis.window.innerWidth <= 768 /* Breakpoint md */);
    }
  });

  // Default to false (desktop) if not yet determined to maintain backward compatibility
  return isMobileSize ?? false;
}
