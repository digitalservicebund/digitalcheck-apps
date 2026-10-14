import { DownloadButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer.tsx";
import Heading from "@/components/Heading";
import InfoBox from "@/components/InfoBox.tsx";
import InfoBoxList from "@/components/InfoBoxList";
import RichText from "@/components/RichText";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { contact } from "@/resources/content/shared/contact.ts";
import { useDocumentationDataService } from "@/routes/dokumentation/DocumentationDataProvider.tsx";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import { dedent } from "@/utils/dedentMultilineStrings";
import { EmojiEventsOutlined as EmojiEventsOutlinedIcon } from "@digitalservicebund/icons";
import { useDocumentationNavigation } from "./dokumentation/DocumentationNavigationContext";

const { finish } = digitalDocumentation;

function InteroperabilitySteps() {
  return (
    <>
      <Heading
        text={"Schritt 2: Interoperabilitäts-Bewertung abschließen"}
        tagName="h2"
        className="mt-64 mb-32"
      />
      <InfoBox
        look="white"
        heading={{
          tagName: "h2",
          look: "kern-heading-medium",
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
      <Heading
        text={firstStepPrefix + finish.heading.text}
        tagName="h1"
        look="kern-heading-large"
        className="mb-16"
      />
      <RichText markdown={finish.heading.markdown} />

      <InfoBoxList>
        <InfoBox
          look="highlight"
          className="bg-white"
          heading={{
            tagName: "h2",
            look: "kern-heading-medium",
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
            look: "kern-heading-medium",
            text: finish.send.heading,
          }}
        >
          <RichText markdown={finish.send.content} />
        </InfoBox>
        <InfoBox
          heading={{
            tagName: "h2",
            look: "kern-heading-medium",
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
