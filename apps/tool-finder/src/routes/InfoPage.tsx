import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

import BetaBanner from "../components/BetaBanner";
import { PATH_QUIZ } from "./";

function InfoPage() {
  useTitle("Visualisieren im Digitalcheck");

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Visualisieren im Digitalcheck",
            }}
            content={{
              markdown: `Die Visualisierung hilft Ihnen, komplexe Sachverhalte zu strukturieren und dadurch schneller und intuitiver erfassbar zu machen – Zusammenhänge werden sichtbar und Sie können Möglichkeiten der Digitalisierung in der Umsetzung identifizieren. Beginnen Sie die Arbeit mit der Visualisierung vor der ersten Textarbeit, um Aspekte der Digitaltauglichkeit frühzeitig zu erkennen und bei der Verschriftlichung Ihres Regelungsvorhabens berücksichtigen zu können.`,
            }}
          ></Header>
        </Container>
      </Background>
      <BetaBanner />
      <Container paddingTop="48" paddingBottom="48">
        <Box
          identifier={"info-section-which-tool"}
          heading={{
            tagName: "h2",
            text: "Mit welchem Werkzeug visualisieren?",
          }}
          content={{
            markdown: `Es existieren eine Vielzahl von Werkzeuge und Programme, in denen Visualisierungen angefertigt werden können. Zudem ist der Katalog an verfügbaren Werkzeugen von Ressort zu Ressort unterschiedlich. Hier können Sie das Werkzeug finden, welches für Ihren Anlass das richtige ist.`,
          }}
          buttons={[
            {
              id: "info-page-find-tool-button",
              text: "Werkzeug finden",
              href: PATH_QUIZ,
              size: "large",
            },
          ]}
        ></Box>
      </Container>
      <Container paddingTop="0" paddingBottom="48">
        <Box
          additionalClassNames="ds-stack-16"
          identifier={"info-section-why-visualisation"}
          heading={{
            tagName: "h2",
            text: "Wobei helfen Ihnen Visualisierungen?",
          }}
          content={{
            markdown: `Die Visualisierung hilft Ihnen, komplexe Sachverhalte zu strukturieren und dadurch schneller 
            und intuitiver erfassbar zu machen. 
- Beim Erstellen der Visualisierung setzen Sie sich bereits mit digitalen Möglichkeiten und neu 
entstehenden Lösungsräumen auseinander. 
- Digitale Möglichkeiten schaffen und erfordern andere Prozesse und Wirklogiken, die sich gut visuell abbilden 
lassen (z. B. Zusammenfassung von Schritten durch Automatisierung, Datenabgleich, Entscheidungslogiken). 
- Eine Visualisierung hilft Ihnen Logikbrüche, Medienbrüche, Inkonsistenzen, offene Verfahrensenden, 
Schleifen, uneinheitliche Rechtsbegriffe und mögliche zu vermeidende Schriftformerfordernisse zu erkennen.`,
          }}
        ></Box>
      </Container>
      <Container
        paddingTop="0"
        paddingBottom="0"
        additionalClassNames={
          "flex flex-col md:flex-row gap-32 md:gap-32 items-start"
        }
      >
        <Box
          additionalClassNames={"pt-20"}
          heading={{
            tagName: "h3",
            text: "Die Darstellungen helfen auch bei der Umsetzung",
          }}
          content={{
            markdown: `Personen, die Ihr Regelungsvorhaben digital umsetzen (z. B. Programmiererinnen und Programmierer), denken in Prozessen, Strukturen, Systemen und Zusammenhängen. Mit einer Visualisierung können Sie diesen beim Verstehen und Übersetzen Ihres Regelungsvorhabens helfen und so eine bessere Umsetzung ermöglichen. Darüber hinaus kann Ihre Visualisierung Ihren Kolleginnen und Kollegen sowie dem NKR das Verständnis erleichtern. Schon einfache Scans oder Fotos Ihrer Skizzen reichen dafür häufig.
            `,
          }}
        ></Box>
        <Background backgroundColor="midBlue" paddingTop="0" paddingBottom="0">
          <Box
            additionalClassNames={"p-20"}
            heading={{
              tagName: "h3",
              text: "Tipp: Schaffen Sie ein gemeinsames Verständnis",
            }}
            content={{
              markdown: `Visualisieren Sie gemeinsam mit Kolleginnen und Kollegen aus Ihrem Referat, anderen Abteilungen, anderen Expertinnen und Experten oder an der Umsetzung beteiligten Akteuren, um schnell ein gemeinsames Verständnis des Regelungsvorhabens und seiner Umsetzungsmöglichkeiten zu schaffen. Die Diskussion auf gleicher Grundlage ist häufig ebenso wertvoll wie die entstandene Visualisierung selbst.`,
            }}
          ></Box>
        </Background>
      </Container>
      <Container paddingTop="16" paddingBottom="48">
        <Box
          content={{
            markdown: `Mehr dazu lesen Sie in diesem Blogbeitrag: [Mit Visualisierungen zu einer digitaltauglichen Gesetzgebung](https://digitalservice.bund.de/blog/mit-visualisierungen-zu-einer-digitaltauglichen-gesetzgebung).
            `,
          }}
        ></Box>
      </Container>
    </>
  );
}

export default InfoPage;
