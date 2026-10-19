import { DownloadButton } from "@/components/Button";
import RichText from "@/components/RichText.tsx";
import type { Prinzip } from "@/content.config";
import { DocumentationContinueActions } from "@/pages/dokumentation/_react/DocumentationContinueActions.tsx";
import { DocumentationDataProvider } from "@/pages/dokumentation/_react/DocumentationDataProvider";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import type { ReactNode } from "react";

const { start } = digitalDocumentation;

type Props = Readonly<{
  prinzips: Prinzip[];
  children?: ReactNode;
}>;

export function DokumentationIndexActions({ prinzips, children }: Props) {
  const { downloadDocumentation } = useWordDocumentation();

  return (
    <div className="mt-40 space-y-40">
      <DocumentationContinueActions prinzips={prinzips} />
      {children}

      <div className="space-y-8">
        <RichText markdown={start.alternative.text} />

        <DownloadButton
          look="link"
          onClick={() =>
            downloadDocumentation(prinzips, {
              templateOnly: true,
            })
          }
        >
          {start.alternative.buttonText}
        </DownloadButton>
      </div>
    </div>
  );
}

// Astro island export
export function DokumentationIndexActionsWithProvider(props: Props) {
  return (
    <DocumentationDataProvider>
      <DokumentationIndexActions {...props} />
    </DocumentationDataProvider>
  );
}
