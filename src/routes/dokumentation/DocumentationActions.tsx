import Button, { DownloadButton, LinkButton } from "@/components/Button";
import ButtonContainer from "@/components/ButtonContainer";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { general } from "@/resources/content/shared/general";
import { useDocumentationNavigation } from "@/routes/dokumentation/DocumentationNavigationContext";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import { PublishedWithChangesOutlined } from "@digitalservicebund/icons";

type SubmitType = {
  submit: true;
  nextUrl?: never;
};

type NextType = {
  submit?: false;
  nextUrl?: string;
};

type DocumentationActionsProps = {
  previousUrl?: string;
  showDownloadDraftButton?: boolean;
  showSavingTip?: boolean;
} & (SubmitType | NextType);

export default function DocumentationActions({
  submit,
  previousUrl,
  nextUrl,
  showDownloadDraftButton = false,
  showSavingTip = false,
}: Readonly<DocumentationActionsProps>) {
  const { downloadDocumentation } = useWordDocumentation();
  const { prinzips } = useDocumentationNavigation();

  return (
    <div className="mt-80 space-y-40">
      <ButtonContainer>
        {previousUrl && (
          <LinkButton href={previousUrl} look="tertiary">
            {general.buttonBack.text}
          </LinkButton>
        )}

        {submit && <Button type="submit">{general.buttonNext.text}</Button>}
        {nextUrl && (
          <LinkButton href={nextUrl}>{general.buttonNext.text}</LinkButton>
        )}

        {showDownloadDraftButton && (
          <DownloadButton
            look="ghost"
            onClick={() => downloadDocumentation(prinzips)}
          >
            {digitalDocumentation.actions.saveDraft.title}
          </DownloadButton>
        )}
      </ButtonContainer>

      {showSavingTip && (
        <p className="text-kern-feedback-success flex flex-row gap-8">
          <PublishedWithChangesOutlined className="fill-kern-feedback-success" />
          {digitalDocumentation.actions.savingTip}
        </p>
      )}
    </div>
  );
}
