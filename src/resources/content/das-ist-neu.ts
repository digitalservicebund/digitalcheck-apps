import {
  bundeslaender,
  dasIstNeu,
  dokumentation,
  interoperabel,
  interoperabel_angrenzendesEuRecht,
  interoperabel_loesungen,
  interoperabel_nationaleKontaktstelle,
  normenkontrollrat,
  prinzipien,
} from "@/config/routes";
import { ZFL_BASE_URL, ZFL_PATH_VISUALISIERUNGEN } from "@/resources/constants";
import { dedent } from "@/utils/dedentMultilineStrings";
import { contact } from "./shared/contact";

export const news = {
  title: "Das ist neu",
  subtitle: dedent`
      Das Digitalcheck-Angebot wird kontinuierlich weiterentwickelt. Bedürfnisse und Rückmeldungen von Nutzenden werden kurzfristig eingearbeitet. Auch geänderte und neue rechtliche Anforderungen führen zu Anpassungen. Unten finden Sie eine chronologische Übersicht der Ergänzungen und Änderungen auf der Website.
      
      Haben Sie Anregungen oder Wünsche? Kontaktieren Sie uns jederzeit gerne unter ${contact.mdPhoneLink()} oder ${contact.mdMailToLink(contact.email, "Supportanfrage: digitalcheck.bund.de")}.
  `,
  items: [
    {
      year: "2026",
    },
    {
      badge: {
        text: "28.08.2026",
      },
      headline: {
        text: "Leitfaden Bundesländer-Digitalcheck",
      },
      content: dedent`
        Neuer Leitfaden zur Einführung eines Digitalcheck im Bundesland

       [Hier ansehen](${bundeslaender.path}#leitfaden)`,
    },
    {
      badge: {
        text: "10.08.2026",
      },
      headline: {
        text: "Neues Design der Website",
      },
      content: dedent`
        Umstellung auf das KERN-Design-System
        
        [KERN UX Standard](https://www.kern-ux.de/)`,
    },
    {
      badge: {
        text: "13.07.2026",
      },
      headline: {
        text: "Neue FAQ ergänzt",
      },
      content: dedent`
        Vorteile des gemeinsamen Digitalchecks für Bund und Länder.
        
        [Hier ansehen](${bundeslaender.path})`,
    },
    {
      badge: {
        text: "06.07.2026",
      },
      headline: {
        text: "Erweiterung der Online-Dokumentation",
      },
      content: dedent`
        Erweiterung der Online-Dokumentation um Fragen zur EU-Interoperabilität
        
        [Hier ansehen](${dokumentation.path})`,
    },
    {
      badge: {
        text: "20.05.2026",
      },
      headline: {
        text: "Neue Seite",
      },
      content: dedent`
        Gemeinsamer Digitalcheck für Bund und Länder
        
        [Hier ansehen](${bundeslaender.path})`,
    },
    {
      badge: {
        text: "11.05.2026",
      },
      headline: {
        text: "Anpassung der Online-Dokumentation",
      },
      content: dedent`
        Anpassung der Online Dokumentation für eine intuitivere Nutzbarkeit:
        - Schlankere Fragestellungen mit einer einfachen Auswahlmöglichkeit von Schwerpunkten
        - Neue Hilfetext-Felder direkt an den Formularfeldern
        - Visuell klare Zusammenfassung der Eingaben
        - Kürzere und übersichtlichere Word-Dokumentation
        - Verbesserte Screenreader-Unterstützung

        [Hier ansehen](${dokumentation.path})`,
    },
    {
      badge: {
        text: "30.03.2026",
      },
      headline: {
        text: "Informationen über EU-Interoperabilität",
      },
      content: dedent`
        Informationen und Umsetzungsvorlage zur verpflichtenden Prüfung von „Lösungen für ein interoperables Europa“ nach Art. 7 der europäischen Interoperabilitätsverordnung (EU) 2024/903. Legistinnen und Legisten erfahren,
        - welche Lösungen für ein interoperables Europa es aktuell gibt,
        - warum das relevant ist,
        - welchen Mehrwert die verbindliche Festschreibung zur Nutzung stiftet.

        [Hier ansehen](${interoperabel_loesungen.path})`,
    },
    {
      badge: {
        text: "26.03.2026",
      },
      headline: {
        text: "Anpassung der Visualisierungs-Beispiele",
      },
      content: dedent`
       - Titel zeigen nun die Alleinstellungsmerkmale der Visualisierungen (z. B. *Grenzüberschreitender Ablauf*).
       - Neues Feld *Aufwand für das Referat*.
       - Neuer Inhalt: Beratungs- und Erfassungsprozess.

       [Hier ansehen](${ZFL_BASE_URL + ZFL_PATH_VISUALISIERUNGEN})
      `,
    },
    {
      badge: {
        text: "16.03.2026",
      },
      headline: {
        text: "Informationen zu angrenzendem EU-Recht",
      },
      content: dedent`
       Zusammenfassungen zu angrenzendem EU-Recht im Kontext des Interoperable Europe Act. Als Legist oder Legistin erfahren Sie: 
          - Welche EU-Rechtsakte könnten für Ihr Vorhaben relevant sein?
          - Was sind die wichtigsten Punkte bezüglich Interoperabilität in dem jeweiligen Rechtsakt?
       
        [Hier ansehen](${interoperabel_angrenzendesEuRecht.path})
      `,
    },
    {
      badge: {
        text: "13.02.2026",
      },
      headline: {
        text: "Leitfaden für Praxis-Perspektiven ergänzt",
      },
      content: dedent`
         - Was sind Vorteile der Praxis-Perspektive und welche Interview-Methoden gibt es?
         - Schritt-für-Schritt-Anleitung: Akteurinnen und Akteure identifizieren und Interviews vorbereiten       
      `,
    },
    {
      badge: {
        text: "28.01.2026",
      },
      headline: {
        text: "Struktur der Prinzipien-Seiten verbessert",
      },
      content: dedent`
         - Übersicht auf der Prinzipien-Startseite klarer strukturiert
         - Darstellung auf den Detailseiten der Prinzipien übersichtlicher gestaltet, einfacher navigierbar und durch Handlungsempfehlungen ergänzt
         
        [Hier ansehen](${prinzipien.path})`,
    },
    {
      year: "2025",
    },
    {
      badge: { text: "18.12.2025" },
      headline: {
        text: "Neue Übersicht: Der Digitalcheck in Zahlen",
      },
      content: dedent`
      "Der Digitalcheck in Zahlen" gibt eine Übersicht, was mit dem Digitalcheck bisher erreicht wurde.
      Dazu zählen durchgeführte Digitalbezugsprüfungen, Regelungsbegleitungen durch das Team, Schulungen,
      Interoperabilitätsberatungen und Vernetzungsangebote.
      `,
    },
    {
      badge: { text: "17.12.2025" },
      headline: { text: "Neue Visualisierungsbeispiele ergänzt" },
      content: dedent`
      Fünf neue Visualisierungen wurden auf unserer "Beispiele für Visualisierungen"-Seite veröffentlicht.
      Diese Visualisierungen wurden von Legist:innen erarbeitet und dienen als Inspiration bzw. Positiv-Beispiele, wie
      Veranschaulichungen helfen, den Ablauf des Regelungsvorhaben noch besser greifen zu können.
      `,
    },
    {
      badge: {
        text: "05.12.2025",
      },
      headline: { text: "Informationen zur Interoperabilität ergänzt" },
      content: dedent`
      - Prozess für Regelungsvorhaben mit grenzüberschreitenden Auswirkungen innerhalb der EU
      - Klare Anforderungen für Interoperabilitätsbewertungen
      - Hintergründe und Ziele der neuen EU-Verordnung
      
      [Hier ansehen](${interoperabel.path})
      `,
    },
    {
      badge: {
        text: "11.11.2025",
      },
      headline: {
        text: "Neue Funktion: Online-Formular für die Dokumentation",
      },
      content: dedent`
        Die Dokumentation kann nun direkt online in einem Formular ausgefüllt werden.
        Ihre Vorteile im Überblick:
          - Hilfreiche Begleitung: Strukturierte Abfragen unterstützen Sie dabei, die Digitalcheck-Prinzipien präzise anzuwenden.
          - Immer aktuell: Sie nutzen automatisch die neueste Fassung. Veraltete Word-Dokumente und Abstimmungsaufwand entfallen.
          - Flexibel bearbeiten: Sie können jederzeit unterbrechen und die Arbeit ohne Datenverlust später fortsetzen.
       Das fertige Ergebnis (wie bisher als Word-Datei) übermitteln Sie direkt an den NKR.
       [Hier ansehen](${dokumentation.path})
      `,
    },
    {
      badge: {
        text: "01.10.2025",
      },
      headline: { text: "Neues Regelungsbeispiel ergänzt" },
      content: "SGB VI-Anpassungsgesetz Einführung Fallmanagement DRV",
    },
    {
      badge: {
        text: "12.09.2025",
      },
      headline: { text: "Video-Anleitung für Flussdiagramme ergänzt" },
      content: "Video bei Schritt 5 ergänzt: Entstehen eines Flussdiagramms.",
    },
    {
      badge: {
        text: "12.09.2025",
      },
      headline: {
        text: "Hinweis bei widersprüchlichen Ergebnissen der Vorprüfung",
      },
      content: dedent`
        - Neuer Hinweis auf Ergebnisseite der Vorprüfung, wenn
          - die Angaben der Vorprüfung ergeben: Kein Digitalbezug
          - bei der Frage zur Interoperabilität aber angegeben wird: Datenaustausch findet statt
        - dann Anzeige eines Hinweises, Ergebnis ist in Bezug auf Datenaustausch (einmal ja / einmal nein) widersprüchlich ist + Aufruf, sich beim Support zu melden
      `,
    },
    {
      badge: {
        text: "11.09.2025",
      },
      headline: { text: "Design der Progress-Bar angepasst" },
      content: "Darstellung der Progress-Bar an Style der Startseite angepasst",
    },
    {
      badge: {
        text: "04.09.2025",
      },
      headline: {
        text: "Anleitung für Flussdiagramme überarbeitet",
      },
      content: dedent`
        - Einstieg in Methode vereinfacht (Erklärung zur Methode ergänzt)
        - Verständlichkeit der Inhalte verbessert
        - Navigation innerhalb der Seite verbessert: Buttons “nächster Schritt“ + vertikale Navigations-Element auf rechter Seite
        
      `,
    },
    {
      badge: {
        text: "01.09.2025",
      },
      headline: { text: "Hinweis in Fragestrecke der Vorprüfung ergänzt" },
      content: dedent`
        Neuer Hinweis in Fragestrecke der Vorprüfung, wenn
        - die Angaben der Vorprüfung ergeben: Kein Digitalbezug
        - bei der Interop-Frage aber angegeben wird: Datenaustausch findet statt
        
        Dann Anzeige eines Hinweises, Ergebnis ist in Bezug auf Datenaustausch (einmal ja / einmal nein) widersprüchlich ist. Wir lassen die - theoretisch mögliche - Kombination aber weiterhin als Ergebnis zu.
      `,
    },
    {
      badge: {
        text: "26.08.2025",
      },
      headline: {
        text: "Domain-Umzug und neue Landingpage für Visualisierungen",
      },
      content: dedent`
        - [digitalcheck.bund.de](https://digitalcheck.bund.de/) führt jetzt zur Digitalcheck Website und nicht mehr zur 
        [Digitale Verwaltung Projektseite](https://www.digitale-verwaltung.de/Webs/DV/DE/transformation/digitalcheck/digitalcheck-node.html)
        - Startseite URL: Fourth-Level-Domain entfernt
          - vorher: erarbeiten.digitalcheck.bund.de → leitet jetzt weiter zu:
          - neu: digitalcheck.bund.de
        - Link zu [Digitale Verwaltung Projektseite](https://www.digitale-verwaltung.de/Webs/DV/DE/transformation/digitalcheck/digitalcheck-node.html) im Footer ergänzt
        - Neue Einstiegsseite / Landingpage für Visualisierungen gelauncht
        - [NKR-Infoseite](${normenkontrollrat.path}) aktualisiert
      `,
    },
    {
      badge: {
        text: "14.08.2025",
      },
      headline: { text: "Beispiele auf der Prinzipien-Seite ergänzt" },
      content: dedent`

- für jedes Prinzip ein Beispiel ergänzt
- wenn sinnvoll: für Aspekte je ein Beispiel ergänzt
- Kontextinfo “Warum ist dieses Beispiel gut“ näher an Regelungsbeispiel-Text platziert

[hier ansehen](${prinzipien.path})
      `,
    },
    {
      badge: {
        text: "05.08.2025",
      },
      headline: {
        text: "Umfangreiches Struktur- und Inhalts-Update (Neue Startseite)",
      },
      content: dedent`
        - Neue [Startseite](/)
        - Neue Grundlagen-Seite: Was ist Digitaltauglichkeit?
        - Neue Grundlagen-Seite: [NKR und Digitalcheck](${normenkontrollrat.path})
        - Neue Dokumentation als Word-Datei v1.5.1 aktualisiert auf Digitalcheck Website, Github und DV
        - Beispiele sind wieder im Footer verlinkt
        - [Nationale Kontaktstelle-Seite](${interoperabel_nationaleKontaktstelle.path}): Zeitleiste neu sortiert (Aktuelles oben)
        - Versionsverlauf: Das PDF auf Digitale Verwaltung ist auf die Digitalcheck Website umgezogen und hat sich dabei in eine [Webpage](${dasIstNeu.path}) verwandelt
        - Der Methodenfahrplan in Grundlagen ist entfernt
      `,
    },
    {
      badge: {
        text: "31.07.2025",
      },
      headline: {
        text: "Update V1.5.1: Dokumentation optimiert",
      },
      content: dedent`
        Kleine Anpassungen an Formatierung und Formulierungen an der Dokumentation, um das Dokument besser lesbar und verständlicher zu machen.

        **Dokumentation:**
        - Fragestellungen zu den Prinzipien „Digitale Angebote für alle nutzbar gestalten“ und „Datenwiederverwendung benötigt einheitliches Recht“ überarbeitet
        - Hinweis zur Vorprüfung ergänzt
        - Bereiche für Antworten zwecks besserer Lesbarkeit mit Rahmen versehen
      `,
    },
    {
      badge: {
        text: "12.06.2025",
      },
      headline: {
        text: "Beispiele-Seite wieder verfügbar",
      },
      content:
        "Die Beispiele wurden an die überarbeiteten Prinzipien angepasst und die Beispiel-Seite wieder online genommen.",
    },
    {
      badge: {
        text: "02.06.2025",
      },
      headline: {
        text: "Update V1.5: Prinzipien neu strukturiert",
      },
      content: dedent`
        Die fünf Prinzipien für digitaltaugliche Gesetzgebung wurden neu strukturiert und um Aspekte der vier Ebenen für Interoperabilität (EU 2024/903) ergänzt.
        
        Aufgrund des 70-Tage Zeitplans der neuen Bundesregierung wurden der Methodenfahrplan und die Dokumentation für diesen begrenzten Zeitraum vereinfacht und gekürzt.
        
        - **Einstiegsseite:**
          - Hinweis-Banner ergänzt
        - **Fünf Prinzipien Unterseite:**
          - Aktualisiert und erweitert
        - **Methodenfahrplan:**
          - Gekürzt auf Visualisierung und Arbeit mit den neuen Prinzipien
        - **Dokumentation:**
          - Fünf Prinzipien aktualisiert
          - Word statt PDF
        - **Beispiele-Seite:**
          - Übergangsweise offline, bis die Beispiele an die überarbeiteten Prinzipien angepasst sind.
      `,
    },
    {
      badge: {
        text: "10.01.2025",
      },
      headline: {
        text: "Update V1.4: Interoperabilitäts-Anforderungen ergänzt",
      },
      content: dedent`
        Die Inhalte der Vorprüfung wurden um Anforderungen erweitert, die sich aus der Verordnung für ein interoperables Europa (EU 2024/903) ergeben.

        - **Einstiegsseite:**
          - Allgemeine Informationen zur EU-Verordnung ergänzt
          - Bereich mit Fragen und Antworten zu den Themen Interoperabilität und zum Digitalcheck hinzugefügt
        - **Fragestrecke:**
          - Frage zur Bestimmung des Interoperabilitäts-Bezugs und Beispiel hinzugefügt
        - **Ergebnisseite:**
          - Ergebnis der Vorprüfung wird als E-Mail an den NKR und bei Interoperabilitätsbezug zusätzlich an die nationale Kontaktstelle beim Digitalcheck-Team gesendet
          - Geänderte Dokumentation über Veraktungs-Option im E-Mail Programm
      `,
    },
    {
      year: "2024",
    },
    {
      badge: {
        text: "21.05.2024",
      },
      headline: {
        text: "Update V1.3: Sprachliche Anpassungen und Dokumenten-Splitting",
      },
      content: dedent`
        - Basierend auf Feedback, Evaluation und Rückmeldungen **sprachliche Anpassungen und Ausführungen eingearbeitet** (Bsp: Regelungsvorhaben anstatt Regelung, um den Sinnzusammenhang herzustellen; Umsetzung anstatt Vollzug, um die breitere Bedeutung der Digitaltauglichkeit klar herauszustellen).
        - **Links und Verweise aktualisiert** (Bsp: digitalcheck.bund.de).
        - **In einzelne Dokumente aufgeteilt:** Vorprüfung, Prinzipienposter: 5 Prinzipien für digitaltaugliche Gesetzgebung, Hilfestellungen und begleitende Dokumentation sind jetzt als einzelne Dokumente als Download verfügbar.
      `,
    },
    {
      year: "2023",
    },
    {
      badge: {
        text: "30.06.2023",
      },
      headline: {
        text: "Update V1.2: Prozess- und Dokumentations-Update",
      },
      content: dedent`
        - Sprachliche Anpassungen und Ausführungen.
        - Der Digitalcheck läuft nun in zwei statt drei Schritten ab. Dabei fällt kein Schritt weg, sondern die beiden letzten Schritte wurden kombiniert.
        - Die Dokumentation leistet jetzt verbesserte Hilfestellung und begleitet die Erarbeitung digitaltauglicher Regelungen. Der Name ist geändert zu ›begleitender Dokumentation‹.
        - Detaillierte Anleitungen zu Prozess-Visualisierungen werden bereitgestellt.
        - Die fünf Prinzipien für digitaltaugliche Gesetze stehen auf einem A4 Poster bereit.
        - Während der begleitenden Methoden werden immer wieder Kurzzusammenfassungen und Tipps herausgestellt, um den Lesefluss zu verbessern und wichtige Punkte stets zur Hand zu geben.
      `,
    },
    {
      badge: {
        text: "27.01.2023",
      },
      headline: {
        text: "Update V1.1: Barrierefreiheit und Einzeldokumente",
      },
      content: dedent`
        - Das PDF ist jetzt barrierefrei/barrierearm.
        - Das Vorblatt enthält jetzt einen Hinweis auf die Übergangsregelung.
        - Neben dem Komplettpaket werden die ausfüllbaren Dokumente (Vorprüfung, Dokumentation und Arbeitsblatt) zusätzlich gesondert zum Download bereitgestellt. Das ermöglicht ein schnelleres Bearbeiten des Digitalchecks bei wiederholter Nutzung.
      `,
    },
    {
      year: "2022",
    },
    {
      badge: {
        text: "27.12.2022",
      },
      headline: {
        text: "Release V1.0",
      },
      content: dedent`
        - Das PDF ist jetzt interaktiv ausfüllbar.
        - Alle Dokumente werden in einem Paket bereitgestellt
      `,
    },
    {
      badge: {
        text: "18.11.2022",
      },
      headline: {
        text: "Erste Version (V0.9) veröffentlicht",
      },
    },
  ],
};
