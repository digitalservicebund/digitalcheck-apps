import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

import flowchartElementsImage from "../../resources/img/flowchart-elements.png";
import Button from "../components/Button";
import ButtonContainer from "../components/ButtonContainer";
import Image from "../components/Image";
import { PATH_RESULT } from "./";

function Flowchart() {
  useTitle("Flussdiagramm Anleitung");

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Flussdiagramm Anleitung",
            }}
          ></Header>
        </Container>
      </Background>
      <Container paddingTop="48" paddingBottom="24">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-heading-03-bold",
            text: "So fangen Sie an",
          }}
          content={{
            markdown: `Es gibt unterschiedliche Arten der Visualisierung. Je nach Zielsetzung eignen 
            sich beispielsweise Nutzerreisen, Entscheidungsbäume, Datenflüsse oder Prozessmodellierungen 
            (z. B. nach BPMN oder FIM-Methodik). Um die Umsetzung eines Regelungsvorhabens zu visualisieren, 
            empfehlen wir die Arbeit mit einem Flussdiagramm.
            
Notieren Sie die an der Umsetzung Beteiligten und deren Aktionen. Fragen Sie sich: 
- Welche Akteure sind beteiligt? (z. B. Bürger oder Bürgerin, eine Behörde, ein System, eine Applikation) 
- Welche Aktionen passieren? (z. B. prüft Angaben, sendet Daten) 
- Wann passiert etwas? (z. B. zeitliche oder prozessuale Abhängigkeit) 
- Wo passiert etwas? (z. B. Medium, Format, Ort, Datenbank) 
- Warum passiert etwas? (Hinweis auf den Paragrafen) 

Der Start mag Ihnen leichter fallen, wenn Sie als Basis eine zeitliche Abfolge wählen. Hier sind einige Elemente, die Sie nutzen können:           
            `,
          }}
        ></Box>
        <div className={"pb-16"}></div>
        <Image
          url={flowchartElementsImage}
          alternativeText="Beispielhafte Darstellung von Elementen eines Flussdiagramms"
        />
      </Container>
      <Container paddingTop="0" paddingBottom="24">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-heading-03-bold",
            text: "Wenn die erste Skizze steht: wenden Sie die fünf Prinzipien für digitaltaugliche Gesetzgebung darauf an",
          }}
          content={{
            markdown: `Markieren Sie in Ihrer Visualisierung, in welchen Schritten der Umsetzung die fünf Prinzipien 
            für digitaltaugliche Gesetzgebung relevant sein könnten. Gehen Sie dabei Prinzip für Prinzip vor. 
            Lassen Sie die dadurch gewonnenen Erkenntnisse in die digitaltaugliche Gestaltung des 
            Regelungsvorhabens einfließen.`,
          }}
        ></Box>
      </Container>
      <Container paddingTop="0" paddingBottom="24">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-heading-03-bold",
            text: "Arbeiten Sie von grob zu fein",
          }}
          content={{
            markdown: `Starten Sie mit reduzierten Informationen und ergänzen Sie nach und nach Details in Ihrem 
            Diagramm. Starten Sie mit Stift auf Papier. Im Mittelpunkt steht der Nutzen der Visualisierung, 
            nicht deren visuelle Qualität.`,
          }}
        ></Box>
      </Container>
      <Container paddingTop="0" paddingBottom="48">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-heading-03-bold",
            text: "Hier bekommen Sie Hilfe",
          }}
          content={{
            markdown: `In Ihrem Referat, in Ihrem Ministerium oder in nachgelagerten Behörden kann es 
            Kolleginnen und Kollegen geben, die bereits mit Visualisierungen arbeiten oder an einem 
            der DigitalcheckWorkshops teilgenommen haben. Bitten Sie sie um Unterstützung oder 
            wenden Sie sich an den Digitalcheck-Support (digitalcheck@digitalservice.bund.de, 
            0151 4076 7839). Mehr zur Visualisierung mit Flussdiagrammen finden Sie hier: 
            [ondea.de/DE/ZfL/ZfL_node.html](https://www.ondea.de/DE/ZfL/ZfL_node.html), Modul 10 im Video “Visualisierung“.`,
          }}
        ></Box>
      </Container>
      <Container paddingTop="0" paddingBottom="48">
        <ButtonContainer>
          <Button
            {...{
              id: "flowchart-guide-page-back-button",
              text: "Zurück",
              href: PATH_RESULT,
            }}
          />
        </ButtonContainer>
      </Container>
    </>
  );
}

export default Flowchart;
