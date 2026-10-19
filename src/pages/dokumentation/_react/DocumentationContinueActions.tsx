import Button, { DownloadButton, LinkButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer.tsx";
import Dialog from "@/components/Dialog.tsx";
import RichText from "@/components/RichText.tsx";
import {
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
} from "@/config/routes";
import type { Prinzip } from "@/content.config";
import { digitalDocumentation } from "@/resources/content/dokumentation.ts";
import { general } from "@/resources/content/shared/general.ts";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import { useNonce } from "@/utils/nonce.ts";
import { navigate } from "astro:transitions/client";
import { useDocumentationDataService } from "./DocumentationDataProvider";

const { start } = digitalDocumentation;

function StartOverDialog({
  deleteDocumentationData,
  prinzips,
}: Readonly<{
  deleteDocumentationData: () => void;
  prinzips: Prinzip[];
}>) {
  const { downloadDocumentation } = useWordDocumentation();

  const downloadDraft = async () => {
    await downloadDocumentation(prinzips);
  };

  return (
    <Dialog
      title={start.startOverDialog.title}
      renderToggleButton={({ toggleDialog }) => (
        <Button
          look="tertiary"
          className={"js-only"}
          onClick={toggleDialog}
          type="button"
        >
          {start.actions.startOver.buttonText}
        </Button>
      )}
      renderActionButtons={({ closeDialog }) => (
        <div className="flex flex-row gap-12">
          <Button
            type="button"
            onClick={async () => {
              deleteDocumentationData();
              await navigate(dokumentation_hinweise.path);
            }}
          >
            {start.startOverDialog.actions.confirm}
          </Button>

          <Button type="button" look="tertiary" onClick={closeDialog}>
            {general.buttonCancel.text}
          </Button>
        </div>
      )}
    >
      <div className="space-y-16">
        <RichText markdown={start.startOverDialog.bodyMarkdown} />
        <DownloadButton look="link" onClick={downloadDraft}>
          {digitalDocumentation.actions.saveDraft.title}
        </DownloadButton>
      </div>
    </Dialog>
  );
}

export function DocumentationContinueActions({
  prinzips,
}: Readonly<{
  prinzips: Prinzip[];
}>) {
  const { hasSavedDocumentation, deleteDocumentationData } =
    useDocumentationDataService();
  const nonce = useNonce();
  return (
    <ButtonContainer>
      {hasSavedDocumentation ? (
        <>
          <LinkButton
            href={dokumentation_regelungsvorhabenTitel.path}
            className="js-only"
          >
            {start.actions.resume.buttonText}
          </LinkButton>
          <StartOverDialog
            deleteDocumentationData={deleteDocumentationData}
            prinzips={prinzips}
          />
        </>
      ) : (
        <LinkButton href={dokumentation_hinweise.path} className="js-only">
          {start.actions.startInitial.buttonText}
        </LinkButton>
      )}
      <noscript>
        {/* Hides the CTA when JavaScript is disabled */}
        <style nonce={nonce}>{".js-only {display: none;}"}</style>
        <Button type={"button"} disabled={true}>
          {start.actions.startInitial.buttonText}
        </Button>
      </noscript>
    </ButtonContainer>
  );
}
