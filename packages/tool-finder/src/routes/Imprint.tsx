import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import useTitle from "services/useTitle";
import { PATH_A11Y, PATH_PRIVACY } from ".";

function Imprint() {
  useTitle("Impressum");

  return (
    <>
      <Background backgroundColor="blue" className="py-48">
        <Container className="py-0">
          <Header
            heading={{
              tagName: "h1",
              text: "Impressum",
            }}
          ></Header>
        </Container>
      </Background>
      <Container className="py-48">
        <Box
          content={{
            markdown: `
**Das Internetangebot wird herausgegeben vom**

Bundesministerium des Innern und für Heimat (BMI)  
Alt-Moabit 140  
10557 Berlin  
Telefon: +49 30 18681-0  
Fax: +49 30 18681-12926  
E-Mail: poststelle@bmi.bund.de  
DE-Mail: poststelle@bmi-bund.de-mail.de 

## Weitere Kontaktmöglichkeiten
<br />

**Redaktionsleitung**  
Abteilung DV (Digitale Verwaltung; Steuerung OZG)  
Referat DV I 3 – Digitale Verwaltungstransformation; Digitalcheck  
Verantwortlich: Dany Homilius (Referatsleiterin DV I 3)  
E-Mail: DVI3@bmi.bund.de
<br /><br />

**Realisierung, Design, Hosting**  
DigitalService GmbH des Bundes  
Christina Lang und Anja Theurer  
Prinzessinnenstraße 8-14  
10969 Berlin  
E-Mail: hallo@digitalservice.bund.de 

## Datenschutz
Erfahren Sie mehr hierzu in der [Datenschutzerklärung](${PATH_PRIVACY})

## Barrierefreiheit
Erfahren Sie mehr hierzu in der [Barrierefreiheitserklärung](${PATH_A11Y})
`,
          }}
        ></Box>
      </Container>
    </>
  );
}

export default Imprint;
