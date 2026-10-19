import { DownloadButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer.tsx";
import InfoBox from "@/components/InfoBox.tsx";
import InfoBoxList from "@/components/InfoBoxList";
import RichText from "@/components/RichText";
import { useDocumentationDataService } from "@/pages/dokumentation/_react/DocumentationDataProvider.tsx";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { contact } from "@/resources/content/shared/contact.ts";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import { dedent } from "@/utils/dedentMultilineStrings";
import { EmojiEventsOutlined as EmojiEventsOutlinedIcon } from "@digitalservicebund/icons";
import { useDocumentationNavigation } from "./DocumentationNavigationContext";

const { finish } = digitalDocumentation;

function InteroperabilitySteps() {
  return (
    <>
      <h2 className="mt-64 mb-32">
        Schritt 2: Interoperabilitäts-Bewertung abschließen
      </h2>
      <InfoBox
        look="white"
        heading={{
          tagName: "h2",
          className: "kern-heading-medium",
          text: "An die Nationale Kontaktstelle senden",
        }}
      >
        <RichText
          markdown={dedent`
            Schicken Sie die ausgefüllte Dokumentation aus Schritt 1 an die Nationale Kontaktstelle.
            Die Interoperabilitäts-Bewertung wird auf dem Portal [„Interoperable
            Europe“](https://interoperable-europe.ec.europa.eu/collection/assessments)
            veröffentlicht, sofern der Referentenentwurf bereits öffentlich
            ist. Falls die Veröffentlichung noch aussteht, wird sich die Nationale
            Kontaktstelle zum von Ihnen angegebenen Zeitpunkt bei Ihnen melden.
            
            **E-Mail der nationalen Kontaktstelle**: ${contact.interoperabilityEmail}
          `}
        />
      </InfoBox>
    </>
  );
}

export function DocumentationSend() {
  const { prinzips } = useDocumentationNavigation();
  const { downloadDocumentation } = useWordDocumentation();
  const { documentationData } = useDocumentationDataService();

  const interoperabilityRequired =
    documentationData.euInteroperabilityOutcome?.outcomeId === "REQUIRED";

  const firstStepPrefix = interoperabilityRequired ? "Schritt 1: " : "";

  return (
    <>
      <h1 className="kern-heading-large mb-16">
        {firstStepPrefix + finish.heading.text}
      </h1>
      <RichText markdown={finish.heading.markdown} />

      <InfoBoxList>
        <InfoBox
          look="highlight"
          className="bg-white"
          heading={{
            tagName: "h2",
            className: "kern-heading-medium",
            text: finish.download.heading,
          }}
        >
          <RichText markdown={finish.download.content} />
          <ButtonContainer>
            <DownloadButton onClick={() => downloadDocumentation(prinzips)}>
              {finish.download.buttonText}
            </DownloadButton>
          </ButtonContainer>
        </InfoBox>
        <InfoBox
          look="highlight"
          className="bg-white"
          heading={{
            tagName: "h2",
            className: "kern-heading-medium",
            text: finish.send.heading,
          }}
        >
          <RichText markdown={finish.send.content} />
        </InfoBox>
        <InfoBox
          heading={{
            tagName: "h2",
            className: "kern-heading-medium",
            text: finish.done,
          }}
          visual={{
            type: "icon",
            Icon: EmojiEventsOutlinedIcon,
            className: "size-80 fill-kern-feedback-success",
          }}
          look="highlight"
          className="bg-kern-feedback-success-background items-center"
        />
      </InfoBoxList>
      {interoperabilityRequired && <InteroperabilitySteps />}
    </>
  );
}
