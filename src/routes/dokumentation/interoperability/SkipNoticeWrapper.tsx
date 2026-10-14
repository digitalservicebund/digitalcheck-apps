import Button from "@/components/Button.tsx";
import InlineNotice from "@/components/InlineNotice.tsx";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import type { ReactNode } from "react";
import { useState } from "react";

export default function SkipNoticeWrapper({
  children,
}: Readonly<{
  children?: ReactNode;
}>) {
  const { documentationData } = useDocumentationDataService();
  const [showAnyway, setShowAnyway] = useState(false);

  if (documentationData.euInteroperabilityOutcome?.outcomeId === "REQUIRED")
    return children;

  return (
    <>
      <InlineNotice look={"info"} heading={"Nur bei Interoperabilitätsbezug"}>
        Sie können diesen Schritt überspringen, da Sie angegeben haben, dass
        kein Interoperabilitätsbezug besteht.
        <Button
          type={"button"}
          look={"link"}
          className={"block"}
          onClick={() => setShowAnyway(!showAnyway)}
        >
          {showAnyway ? "Formular ausblenden" : "Trotzdem anzeigen"}
        </Button>
      </InlineNotice>
      {showAnyway && (
        <div
          className={
            "outline-kern-decorative-border p-16 outline-4 outline-dashed"
          }
        >
          {children}
        </div>
      )}
    </>
  );
}
