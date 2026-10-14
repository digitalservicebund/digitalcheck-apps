import { DownloadButton } from "@/components/Button";
import Container from "@/components/Container.tsx";
import ContentWrapper from "@/components/ContentWrapper.tsx";
import { Feature, FeatureList } from "@/components/FeatureList.tsx";
import Heading from "@/components/Heading.tsx";
import Hero from "@/components/Hero";
import InfoBox from "@/components/InfoBox.tsx";
import InlineNotice from "@/components/InlineNotice";
import NumberedList from "@/components/NumberedList.tsx";
import RichText from "@/components/RichText.tsx";
import SupportBanner from "@/components/SupportBanner";
import type { Prinzip } from "@/content.config";
import { digitalDocumentation } from "@/resources/content/dokumentation";
import { supportBanner } from "@/resources/content/shared/support-banner";
import { DocumentationContinueActions } from "@/routes/dokumentation/DocumentationContinueActions.tsx";
import { useWordDocumentation } from "@/service/wordDocumentationExport/wordDocumentation";
import {
  SimCardDownloadTwoTone,
  TipsAndUpdatesOutlined,
  ViewListTwoTone,
} from "@digitalservicebund/icons";

const { start } = digitalDocumentation;

export function DokumentationIndexPage({
  prinzips,
}: Readonly<{
  prinzips: Prinzip[];
}>) {
  const { downloadDocumentation } = useWordDocumentation();

  return (
    <>
      <main>
        <Hero title={start.title} subtitle={start.subtitle}>
          <div className="mt-40 space-y-40">
            <DocumentationContinueActions prinzips={prinzips} />
            <noscript>
              <InlineNotice
                look="warning"
                heading={
                  <Heading tagName="h2">{start.noscript.headline}</Heading>
                }
                className="mb-40"
              >
                <RichText markdown={start.noscript.content} />
              </InlineNotice>
            </noscript>

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
        </Hero>

        <ContentWrapper className={"space-y-80"}>
          <section className="space-y-40">
            <Heading tagName="h2">Vorteile der Online-Dokumentation</Heading>
            <FeatureList>
              <Feature>
                <ViewListTwoTone className="fill-ds-feature size-80" />
                <p>
                  Sie werden <strong>Schritt für Schritt</strong> durch den
                  Prozess geführt und setzen eigene{" "}
                  <strong>Schwerpunkte</strong>. Beispiele erleichtern das
                  Erfassen der Digitaltauglichkeit.
                </p>
              </Feature>
              <Feature>
                <SimCardDownloadTwoTone className="fill-ds-feature size-80" />
                <p>
                  Bearbeiten Sie die Dokumentation{" "}
                  <strong>flexibel im Formular</strong> oder speichern Sie sie
                  als <strong>Word-Datei</strong>. Abschließend senden Sie die
                  Angaben an Ihre zuständige Prüfstelle (z. B. auf Bundesebene
                  an den NKR). Ansonsten dient die Dokumentation zur
                  Selbstprüfung.
                </p>
              </Feature>
            </FeatureList>
          </section>
          <section className="space-y-40">
            <Heading tagName="h2">So funktioniert es</Heading>
            <NumberedList>
              <NumberedList.Item className={"space-y-8"}>
                <p className="kern-body kern-body--large">
                  Bearbeiten Sie die Dokumentation online
                </p>
                <p>
                  Sie durchlaufen einen geführten Prozess, der auf den fünf
                  Prinzipien für digitaltaugliche Gesetzgebung basiert.
                  Alternativ können Sie die Dokumentation als Word-Datei
                  herunterladen und bearbeiten.
                </p>
              </NumberedList.Item>
              <NumberedList.Item className={"space-y-8"}>
                <p className="kern-body kern-body--large">
                  Senden Sie die ausgefüllte Dokumentation an Ihre Prüfstelle
                  oder speichern Sie das Dokument ab
                </p>
                <p>
                  Exportieren Sie Ihre Eingaben als Word-Datei und schicken Sie
                  diese zu jedem Zeitpunkt per E-Mail an Ihre zuständige
                  Prüfstelle oder speichern Sie das Dokument ab. Die
                  E-Mail-Adresse finden Sie am Ende der
                  Dokumentationserstellung.
                </p>
              </NumberedList.Item>
            </NumberedList>
          </section>
        </ContentWrapper>
        <div className="bg-kern-darkblue-025 py-80 max-lg:px-16">
          <Container className="bg-white">
            <InfoBox
              visual={{
                type: "icon",
                Icon: TipsAndUpdatesOutlined,
                className: "fill-kern-darkblue-150",
              }}
              heading={{
                tagName: "h2",
                text: "Hilfreiche Tipps zum Ausfüllen der Dokumentation",
                look: "kern-heading-medium",
              }}
            >
              <p>
                <strong>Aufwand sparen:</strong> Fassen Sie zusammengehörige
                Regelungen in einer Dokumentation zusammen.
              </p>
              <p>
                <strong>Zweite Meinung nutzen:</strong> Teilen Sie
                Zwischenstände mit Kolleginnen und Kollegen, um Feedback
                einzuholen.
              </p>
              <p>
                <strong>Visualisierung einbeziehen:</strong> Nutzen Sie Ihre
                bereits selbst erstellten Visualisierungen (auf Basis der fünf
                Prinzipien) als Grundlage und senden Sie diese am Ende an den
                NKR.
              </p>
            </InfoBox>
          </Container>
        </div>
      </main>
      <SupportBanner {...supportBanner} />
    </>
  );
}

// Astro page export
import { DocumentationDataProvider } from "@/routes/dokumentation/DocumentationDataProvider";

export function DokumentationIndexPageWithProvider({
  prinzips,
}: Readonly<{
  prinzips: Prinzip[];
}>) {
  return (
    <DocumentationDataProvider>
      <DokumentationIndexPage prinzips={prinzips} />
    </DocumentationDataProvider>
  );
}
