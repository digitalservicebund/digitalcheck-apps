import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

function Privacy() {
  useTitle("Datenschutzerklärung");

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Datenschutzerklärung",
            }}
          ></Header>
        </Container>
      </Background>
      <Container paddingTop="48" paddingBottom="48">
        <Box
          content={{
            markdown: `
## 1. Grundlagen
### 1.1 Verantwortlicher und Datenschutzbeauftragte/r
Verantwortlich für die Verarbeitung von personenbezogenen Daten im Rahmen der Bereitstellung der Website https://visualisieren.digitalcheck.bund.de/ ist das Bundesministerium des Innern und für Heimat (BMI).  

**Bundesministerium des Innern und für Heimat (BMI)**  
Alt-Moabit 140  
10557 Berlin  
Tel.: 030 / 18 681-0  
Fax: 030 / 18 681-12926  
E-Mail: poststelle@bmi.bund.de  

Bei Fragen zum Datenschutz und zu dieser Datenschutzerklärung erreichen Sie die bzw. den Datenschutzbeauftragte/n des BMI unter:  

**Beauftragte/r für den Datenschutz im BMI (BDS)**  
Alt-Moabit 140  
10557 Berlin  
Tel.: 030 / 18 681-0  
E-Mail: bds@bmi.bund.de

### 1.2 Personenbezogene Daten
Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt – insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten und/oder zu einer Online-Kennung – identifiziert werden kann.

### 1.3 Auftragsverarbeiter  
DigitalService GmbH des Bundes  
Prinzessinnenstraße 8-14  
10969 Berlin  

DigitalService ist eine Bundes GmbH. Die Bundesrepublik Deutschland – vertreten durch das Bundesministerium des Innern und für Heimat – hält 100 Prozent der Anteile der GmbH. Mit dem Auftragsverarbeiter wurde eine Vereinbarung gemäß Art. 28 DSGVO geschlossen.

**Datenschutzbeauftragter des Auftragsverarbeiters**  
Des Weiteren können Sie datenschutzrechtliche Fragen auch an den Datenschutzbeauftragten des DigitalService richten. Diesen erreichen Sie unter folgender Adresse:
E-Mail: datenschutz@digitalservice.bund.de
## 2. Verarbeitung personenbezogener Daten im Zusammenhang mit der Nutzung der Website und Rechtsgrundlagen
### 2.1 Besuch dieser Seite
Zur Verbesserung und Analyse des Nutzendenverhaltens setzen wir ein Produkt-Analyse-Tool (plausible.io) ein, das uns anonym erhobene Daten über die Nutzung unserer Website liefert. Dies hilft uns, das Nutzendenverhalten zu verstehen und unsere Inhalte und Dienstleistungen kontinuierlich zu verbessern. Der Diensteanbieter plausible erhebt die IP-Adresse und wandelt diese sofort in ein anonymisiertes Format um. Ab diesem Zeitpunkt werden keine personenbezogenen Daten mehr verarbeitet.

Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von plausible: https://plausible.io/data-policy

Folgende Daten werden für die Analyse verarbeitet:  

**Standortdaten**
- IP-Adresse

**Daten zum Nutzungsverhalten**  
- Besuchte Seiten
- Klickverhalten
- Zeitpunkt des Besuchs

**Technische Daten**  
- Browser und Browserversion
- Gerätetyp
- Betriebssystem des Geräts

**Verlaufsdaten**  
- Verweisende Seite (von welcher Seite sind Sie auf diese Seite gekommen)

Um die Stabilität (Fehlerkorrektur) und Sicherheit des Angebotes zu gewährleisten sowie um das BSI bei der Abwehr von Gefahren für die Kommunikationstechnik des Bundes zu unterstützen, werden die Daten automatisch in sogenannte Logfiles (technische Protokolldateien) geschrieben und dort angelehnt an § 5 BSIG für eine Dauer von 90 Tagen aufbewahrt. Danach werden sie automatisch gelöscht. Der Zugriff ist durch technische und organisatorische Maßnahmen nur einem festgelegten und nachvollziehbaren Kreis von entsprechend angewiesenen Administratorinnen und Administratoren möglich. 

Der Datenverkehr zwischen Ihrem Webbrowser und den Servern des Dienstes erfolgt über eine verschlüsselte HTTPS-Verbindung. HTTPS ist eine gesicherte Variante des Verbindungsprotokolls (HTTP), mit dem Webbrowser und Server Daten (bspw.: Ihre Eingaben) über das Internet austauschen, um zu verhindern, dass unbefugte Dritte von diesen Kenntnis erhalten. 

Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. e) DSGVO i.V.m. § 3 BDSG. Die Datenverarbeitung dient der zielgerichteten und ausgewogenen Öffentlichkeitsarbeit sowie dem Schutz der IT-Infrastruktur des Bundes. Die damit verbundene Verarbeitung Ihrer Daten beim Besuch der Seite geschieht zu diesem Zweck. Für die Erfüllung dieser Verarbeitungszwecke ist die Verarbeitung der genannten personenbezogenen Daten erforderlich. 

### 2.2 Kontaktaufnahme
Die Verarbeitung personenbezogener Daten erfolgt in Abhängigkeit des Kontaktweges. Hierbei kann zwischen Kontaktaufnahme per E-Mail, per Kontaktformular oder Telefon unterschieden werden. Nähere Details zur Verarbeitung Ihrer Daten im Falle der Kontaktaufnahme mit dem BMI entnehmen Sie bitte der allgemeinen [Datenschutzerklärung](https://www.bmi.bund.de/DE/service/datenschutz/datenschutz_node.htm) des BMI.

Bei Anfragen an die Kontakt-E-Mail-Adresse digitalcheck@digitalservice.bund.de werden durch den Auftragsverarbeiter ausschließlich solche Daten verarbeitet, die notwendig sind, um mit Ihnen zu kommunizieren. Hierzu gehören insbesondere jene personenbezogenen Informationen (z. B. Name, Vorname, Anschrift, E-Mail-Adresse usw.), die unmittelbar von Ihnen übersandt werden. Die Löschung der personenbezogenen Daten erfolgt sechs Monate nach dem Zugang der letzten E-Mail. Weitere personenbezogene Daten werden auf dieser Webseite nicht erhoben und verarbeitet.

Die Verarbeitung der Daten ist zur Wahrnehmung unserer Aufgaben erforderlich (Art. 6 Abs. 1 UAbs. 1 lit. e) DSGVO in Verbindung mit § 3 BDSG).

## 3. Datenempfänger 
Das BMI setzt im Rahmen einer Auftragsverarbeitung die DigitalService GmbH des Bundes als Dienstleister ein. Mit diesem Dienstleister wurde ein Vertrag gemäß Artikel 28 Abs. 3 DSGVO geschlossen; datenschutzrechtlich verantwortlich ist das BMI. 

Darüber hinaus kann es im Einzelfall zur Weitergabe von Daten an Dritte kommen, soweit wir hierzu rechtlich verpflichtet sind oder dies zur Abwehr einer Gefahr für die öffentliche Sicherheit, zur Verfolgung von Straftaten oder zur Abwehr von Angriffen auf unsere IT-Infrastrukturen erforderlich ist. Eine Weitergabe in anderen Fällen erfolgt nicht. Eine Zusammenführung dieser Daten mit anderen Datenquellen zum Beispiel zum Anlegen von Nutzerprofilen erfolgt durch das BMI nicht.

## 4. Werden personenbezogene Daten an Dritte weitergegeben?
Personenbezogene Daten werden ausschließlich in Deutschland verarbeitet und nicht an Dritte weitergeleitet. 

## 5. Maßnahmen zur Einhaltung der Datensicherheit
Wir ergreifen umfangreiche Maßnahmen, um die Sicherheit Ihrer Daten zu gewährleisten und unbefugten Zugriff zu verhindern. Hier sind einige der Schritte, die wir unternehmen:

<ol type="a" class="pl-24 list-outside list-[lower-alpha]">
<li>Sicherheit der Übertragung und Speicherung: Die von Ihnen übermittelten Daten werden per HTTPS verschlüsselt an uns übermittelt und auf verschlüsselten Festplatten gespeichert. Dadurch wird sichergestellt, dass Ihre Informationen während der Übertragung und Speicherung geschützt sind.</li>
<li>Zugriffskontrollen: Wir verwenden strikte Zugriffskontrollen, um sicherzustellen, dass nur autorisierte Personen Zugriff auf die Systeme und Daten haben. Dies umfasst die Verwendung von sicheren Authentifizierungsmethoden und Berechtigungsverwaltungssystemen.</li>
<li>Überwachung und Auditing: Unsere Systeme werden kontinuierlich überwacht, um verdächtige Aktivitäten zu erkennen und zu verhindern. Wir führen auch regelmäßige interne & externe Audits durch, um sicherzustellen, dass alle Sicherheitsvorkehrungen ordnungsgemäß funktionstüchtig sind.</li>
<li>Schulung der Mitarbeiter: Unsere Mitarbeiter werden regelmäßig zu Datenschutz- und Sicherheitsrichtlinien geschult, um sicherzustellen, dass sie die erforderlichen Maßnahmen ergreifen, um die Vertraulichkeit der Daten zu wahren.</li>
</ol>

Im Rahmen der Verwendung des Dienstes Plausible wurden weitere Maßnahmen zur Sicherheit der personenbezogenen Daten getroffen:
- Speichern der Daten auf Servern in Deutschland
- Beschränkte Zugriffsrechte auf die Daten
- Anonymisierung von IP-Adressen
- Wir sammeln nur Datenpunkte, die relevant sind für die weitere Produktentwicklung im Sinne der Nutzerfreundlichkeit und Erweiterung von Funktionen 


## 6. Ihre Rechte
Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:  
- **Recht auf Auskunft, Art. 15 DSGVO**
Mit dem Recht auf Auskunft erhält der Betroffene eine umfassende Einsicht in die ihn angehenden Daten und einige andere wichtige Kriterien wie beispielsweise die Verarbeitungszwecke oder die Dauer der Speicherung. Es gelten die in § 34 BDSG geregelten Ausnahmen von diesem Recht.
- **Recht auf Berichtigung, Art. 16 DSGVO**
Das Recht auf Berichtigung beinhaltet die Möglichkeit für den Betroffenen, unrichtige oder unvollständige ihn angehende personenbezogene Daten korrigieren zu lassen.
- **Recht auf Löschung, Art. 17 DSGVO**
Das Recht auf Löschung beinhaltet die Möglichkeit für den Betroffenen, Daten beim Verantwortlichen löschen zu lassen. Dies ist allerdings nur dann möglich, wenn die ihn angehenden personenbezogenen Daten nicht mehr notwendig sind, rechtswidrig verarbeitet werden oder eine diesbezügliche Einwilligung widerrufen wurde. Es gelten die in § 35 BDSG geregelten Ausnahmen von diesem Recht.
- **Recht auf Einschränkung der Verarbeitung, Art. 18 DSGVO**
Das Recht auf Einschränkung der Verarbeitung beinhaltet die Möglichkeit für den Betroffenen, eine weitere Verarbeitung der ihn angehenden personenbezogenen Daten vorerst zu verhindern. Eine Einschränkung tritt vor allem in der Prüfungsphase anderer Rechtewahrnehmungen durch den Betroffenen ein.
- **Recht auf Datenübertragbarkeit, Art. 20 DSGVO**
Das Recht auf Datenübertragbarkeit beinhaltet die Möglichkeit für den Betroffenen, die ihn angehenden personenbezogenen Daten in einem gängigen, maschinenlesbaren Format vom Verantwortlichen zu erhalten, um sie ggf. an einen anderen Verantwortlichen weiterleiten zu lassen. Gemäß Art. 20 Abs. 3 Satz 2 DSGVO steht dieses Recht aber dann nicht zur Verfügung, wenn die Datenverarbeitung der Wahrnehmung öffentlicher Aufgaben dient.
Recht auf Widerruf der Einwilligung, Art.7 Abs.3 DSGVO
Soweit die Verarbeitung der personenbezogenen Daten auf Grundlage einer Einwilligung erfolgt, kann der Betroffene diese jederzeit für den entsprechenden Zweck widerrufen. Die Rechtmäßigkeit der Verarbeitung aufgrund der getätigten Einwilligung bleibt bis zum Eingang des Widerrufs unberührt.
- **Recht auf Widerspruch gegen die Erhebung, Verarbeitung und bzw. oder Nutzung, Art. 21 DSGVO**
Das Recht auf Widerspruch beinhaltet die Möglichkeit, für Betroffene in einer besonderen Situation der weiteren Verarbeitung ihrer personenbezogenen Daten zu widersprechen, soweit diese durch die Wahrnehmung öffentlicher Aufgaben oder öffentlicher sowie privater Interessen rechtfertigt ist. Es gelten die in § 36 BDSG geregelten Ausnahmen von diesem Recht.

Zur Ausübung der vorgenannten Rechte können Sie sich schriftlich an die unter Ziffer 1.1 genannten Stellen wenden.

Ihnen steht zudem gemäß Art. 77 DSGVO ein Beschwerderecht bei der datenschutzrechtlichen Aufsichtsbehörde, dem [Bundesbeauftragten für den Datenschutz und die Informationsfreiheit](https://www.bfdi.bund.de/DE/Home/home_node.html), Graurheindorfer Str. 153, 53117 Bonn zu.
`,
          }}
        ></Box>
      </Container>
    </>
  );
}

export default Privacy;
