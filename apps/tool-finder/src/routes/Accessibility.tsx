import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

function Accessibility() {
  useTitle("Erklärung zur Barrierefreiheit");

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Erklärung zur Barrierefreiheit",
            }}
            content={{
              markdown: `Informationen über die Zugänglichkeit dieser Webseiten gemäß § 12 Behindertengleichstellungsgesetz (BGG) sowie über diesbezügliche Kontaktmöglichkeiten.`,
            }}
          ></Header>
        </Container>
      </Background>
      <Container paddingTop="48" paddingBottom="48">
        <Box
          content={{
            markdown: `
Das Bundesministerium des Innern, für Bau und Heimat (BMI) ist bemüht, seine Webseite [visualisieren.digitalcheck.bund.de](visualisieren.digitalcheck.bund.de) so weit wie möglich barrierefrei zu gestalten. Rechtsgrundlage sind das Behindertengleichstellungsgesetz (BGG), die Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und die harmonisierte europäische Norm EN 301 549 in ihrer jeweils gültigen Fassung.

Im Rahmen eines internen Tests wurde jedoch festgestellt, dass der Webauftritt noch keine vollständige Barrierefreiheit gewährleistet. Das BMI arbeitet dementsprechend mit Nachdruck daran, die barrierefreie Gestaltung seiner Webseite weiter zu verbessern.
            
Diese Erklärung wurde am 12. März 2024 erstellt.

## Welche Bereiche sind nicht barrierefrei?
Teilbereiche, die z. B. nicht barrierefrei sind:
* **Externe Links** können nicht immer barrierefrei angeboten werden, da sie auf Inhalte oder Ressourcen außerhalb des aktuellen Angebots verweisen, auf die wir keinen direkten Einfluss haben.
* **Anderssprachige Abschnitte und Wörter** sind nicht immer technisch als solche gekennzeichnet, was zu unverständlicher Aussprache in Vorlese-Software führen kann.

## Barriere melden! Hinweise zur Barrierefreiheit
Sind Ihnen weitere Mängel beim barrierefreien Zugang zu Inhalten von [visualisieren.digitalcheck.bund.de](visualisieren.digitalcheck.bund.de) aufgefallen? Dann können Sie sich gerne bei uns melden:

Bundesministerium des Innern und Heimat (BMI)  
Alt Moabit 140  
10557 Berlin  
Telefon: 03018 681 - 0  
Telefax: 03018 681 - 12926  
E-Mail: DVI3@bmi.bund.de  

## Schlichtungsverfahren
Wenn auch nach Ihrem Hinweis an den oben genannten Kontakt keine zufriedenstellende Lösung gefunden wurde, können Sie sich an die Schlichtungsstelle nach § 16 BGG wenden. Die Schlichtungsstelle BGG hat die Aufgabe, bei Konflikten zum Thema Barrierefreiheit zwischen Menschen mit Behinderungen und öffentlichen Stellen des Bundes eine außergerichtliche Streitbeilegung zu unterstützen. Dabei geht es nicht darum, Gewinner oder Verlierer zu finden. Vielmehr ist es das Ziel, mit Hilfe der Schlichtungsstelle gemeinsam und außergerichtlich eine Lösung für ein Problem zu finden. Das Schlichtungsverfahren ist kostenlos. Es muss kein Rechtsbeistand eingeschaltet werden.
Auf der Internetseite der Schlichtungsstelle finden Sie alle Informationen zum Schlichtungsverfahren. Dort können Sie nachlesen, wie ein Schlichtungsverfahren abläuft und wie Sie den Antrag auf Schlichtung stellen. Sie können den Antrag dort auch in Leichter Sprache oder in Deutscher Gebärdensprache stellen.
<br/><br/>
Sie erreichen die Schlichtungsstelle unter folgender Adresse:

**Schlichtungsstelle nach dem Behindertengleichstellungsgesetz bei dem Beauftragten der Bundesregierung für die Belange von Menschen mit Behinderungen**

Mauerstraße 53  
10117 Berlin

Telefon: 030 18 527-2805  
Fax: 030 18 527-2901  
E-Mail: info@schlichtungsstelle-bgg.de  
Internet: www.schlichtungsstelle-bgg.de
            `,
          }}
        ></Box>
      </Container>
    </>
  );
}

export default Accessibility;
