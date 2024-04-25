import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

export default function FeedbackBanner() {
  const email = "digitalcheck@digitalservice.bund.de";
  const subject = "Rückmeldung zum Werkzeugfinder";
  const interviewText =
    "Ich stehe gerne für ein Gespräch zur Verfügung, um Feedback zu geben.";

  return (
    <Background backgroundColor="midBlue" paddingTop="32" paddingBottom="40">
      <Container paddingTop="0" paddingBottom="0">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: "Es fehlt ein Werkzeug? Sie haben allgemeine Fragen oder Anmerkungen?",
          }}
          content={{
            markdown: `Dieser Dienst ist im Aufbau. Wenn Ihnen etwas fehlt, oder etwas nicht funktioniert, kontaktieren Sie uns über <a href="mailto:${email}?subject=${subject}" class="text-link">${email}</a> oder 0151/40 76 78 39. Ihr Feedback trägt dazu bei, Informationen und Gestaltung der Webseite für alle Nutzenden zu verbessern.`,
          }}
        ></Box>
      </Container>
      <Container paddingTop="24" paddingBottom="0">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: "Wir suchen Gesprächspartner!",
          }}
          content={{
            markdown: `Um diese Seite weiterzuentwickeln, suchen wir nach Personen, die uns in einem 45-minütigen Gespräch Feedback geben. Schreiben Sie uns gerne eine E-Mail und wir melden uns bei Ihnen: <a href="mailto:${email}?subject=${subject}&body=${interviewText}" class="text-link">${email}</a>.`,
          }}
        ></Box>
      </Container>
    </Background>
  );
}
