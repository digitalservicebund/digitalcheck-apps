import { useEffect } from "react";

const useTitle = (title?: string) => {
  useEffect(() => {
    document.title = title
      ? `${title} - Digitalcheck Werkzeugfinder`
      : "Digitalcheck Werkzeugfinder";
  }, [title]);
};

export default useTitle;
