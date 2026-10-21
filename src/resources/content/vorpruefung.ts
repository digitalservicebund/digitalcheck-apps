import {
  interoperabel,
  vorpruefung_automatisierung,
  vorpruefung_datenaustausch,
  vorpruefung_euBezug,
  vorpruefung_itSystem,
  vorpruefung_kommunikation,
  vorpruefung_verpflichtungenFuerBeteiligte,
} from "@/config/routes";
import type { TQuestion } from "@/pages/vorpruefung/_react/question";
import type { ContentLink } from "@/utils/contentTypes.ts";
import { dedent } from "@/utils/dedentMultilineStrings";
import { withBase } from "@/utils/path";
import { contact } from "./shared/contact";

export const preCheck = {
  preCheckName: "Vorprüfung",
  start: {
    title: "Vorprüfung: Digitalbezug einschätzen",
    subtitle:
      "Finden Sie in 6 Fragen heraus, ob Sie in Ihrem Regelungsvorhaben Aspekte der digitalen Umsetzung und EU-Anforderungen an Interoperabilität beachten müssen.",
    hints: [
      {
        title: "Was ist Digitalbezug?",
        text: dedent`
          Digitalbezug beschreibt die digitale Umsetzung, wenn ein Prozess nach Inkrafttreten eines Vorhabens zumindest teilweise durch ein IT-System abgebildet wird. Beispiele sind:
          - eine Reihe von Aufgaben mit einem bestimmten Ziel, zum Beispiel das Ausfüllen eines Formulars in ELSTER, um die Steuererklärung einzureichen,
          - die Abfrage von Daten aus einem Register oder
          - das Bereitstellen von Informationen auf einer Website.
        `,
      },
      {
        title: "Was ist Interoperabilität?",
        text: "Interoperabilität macht ein digitales Europa ohne Grenzen möglich, in dem Behörden nahtlos Daten austauschen können. Ob Umzug oder Firmengründung im Ausland – Verwaltungsakte lassen sich EU-weit einfach, sicher und vollständig online erledigen. Das spart Zeit und Kosten. Grundlage dafür ist die [Verordnung für ein interoperables Europa (EU) 2024/903](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R0903).",
      },
    ],
    buttonText: "Vorprüfung starten",
    summary: {
      tabName: "Zusammengefasst",
      heading: {
        text: "Zusammengefasst",
      },
      start: {
        heading: {
          text: "Beginnen Sie so früh wie möglich",
        },
        content:
          "Führen Sie die Vorprüfung zu Beginn Ihrer Arbeit an einem Regelungsvorhaben durch. Das heißt, bevor Sie den Regelungstext formulieren.",
      },
      process: {
        heading: "So gehen Sie vor:",
        image: {
          caption:
            "Der Ablauf des Digitalchecks auf Bundesebene: Von der Vorprüfung bis zur Dokumentation",
          alternativeText:
            'Der Prozess auf Bundesebene beginnt mit einer geführten Vorprüfung auf Digitalbezug und Anforderungen an Interoperabilität. Daraus ergeben sich drei mögliche Ergebnisse mit unterschiedlichen Prozessschritten: Bei dem Ergebnis "kein Digitalbezug" ist der Erarbeitungsprozess abgeschlossen und wird dem Normenkontrollrat zur Prüfung übermittelt. Bei dem Ergebnis "Digitalbezug" wird das Ergebnis per E-Mail an den Normenkontrollrat gesendet, gefolgt von einer Schritt-für-Schritt-Anleitung und der Dokumentation der Erstellung des Digitalbezugs, die abschließend vom Normenkontrollrat geprüft wird. Für das Ergebnis " Digitalbezug & Anforderungen an die Interoperabilität" wird das Ergebnis per E-Mail an den Normenkontrollrat und das Digitalcheck-Team gesendet, gefolgt von einer Schritt-für-Schritt-Anleitung mit Unterstützung durch das Digitalcheck-Team, der Dokumentation der Erstellung des Digitalbezugs und der Bewertung der Interoperabilität. Die Dokumentation wird anschließend auf dem Interoperable Europe Portal zur Verfügung gestellt.',
        },
      },
      relevance: {
        heading: {
          text: "Warum ist die Vorprüfung relevant für mein Vorhaben?",
        },
        content: dedent`
          - **Digitalisierungsbezug frühzeitig erkennen:** Setzen Sie sich
            frühzeitig mit Chancen der Digitalisierung auseinander, um den
            Regelungstext so zu gestalten, dass er die praxisnahe Umsetzung
            ermöglicht.
          - **EU-Anforderungen identifizieren:** Im Rahmen der Vorprüfung
            ermitteln Sie, ob grenzüberschreitende Interoperabilität für Ihr
            Vorhaben relevant ist. Regelungen, die Interoperabilität fördern,
            ermöglichen technische Standardisierung, rechtliche Harmonisierung und
            digitale bürgerzentrierte Dienste innerhalb der EU.
          - **Rechtliche Grundlage:** Seit Juni 2024 ist es verpflichtend,
            Regelungsvorhaben auf Bundesebene auf Digitaltauglichkeit zu prüfen.
            Der Normenkontrollrat prüft die Durchführung auf Grundlage von [§ 4
            Abs. 3 NKRG](https://www.gesetze-im-internet.de/nkrg/__4.html).
            Zusätzlich müssen ab Januar 2025 bestimmte Regelungsvorhaben die
            Anforderungen an Interoperabilität auf EU-Ebene unterstützen. Dies
            ergibt sich aus der [EU-Verordnung für ein interoperables Europa (EU)
            2024/903](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R0903).
          `,
      },
    },
    info: {
      tabName: "Digitalbezug und Interoperabilität",
      title: "Digitalbezug und Interoperabilität",
      text: dedent`
        Digitalbezug und Interoperabilität sind eng miteinander verknüpft. Wenn ein Gesetz oder eine Regelung digitale Prozesse vorsieht, müssen oft technische und organisatorische Standards eingehalten werden. 
        Interoperabilität bedeutet, dass verschiedene öffentliche Institutionen über Ländergrenzen hinweg zusammenarbeiten können.

        <p class="mt-24">Wenn ein Vorhaben die EU-Anforderungen für Interoperabilität erfüllen muss, hat es automatisch auch einen Digitalbezug.</p>
      `,
      image: {
        src: withBase("/images/digital-readiness-meets-interop.svg"),
        alt: "Illustration von Datenaustausch zwischen zwei Computer-Systemen mit EU-Flagge, symbolisiert europäische digitale Zusammenarbeit.",
      },
      action: {
        text: "Alles zur Interoperabilität",
        to: interoperabel.path,
      } satisfies ContentLink,
    },
    noscript: {
      headline: "Erlauben Sie die Nutzung von JavaScript",
      content: dedent`
        Um die Vorprüfung zu starten, müssen Sie Ihrem Browser die Nutzung von JavaScript erlauben. Das ist nötig, damit die Seite Ihre Daten zwischenspeichern kann.
        
        **So geht es:** Suchen Sie in den Einstellungen Ihres Browsers nach JavaScript und erlauben Sie die Nutzung.
      `,
    },
  },
  startOver: {
    title: "Neue Vorprüfung beginnen",
    buttonText: "Neue Vorprüfung beginnen",
    confirm: "Neu beginnen",
    bodyMarkdown:
      "Mit einer neuen Vorprüfung werden die Daten der begonnenen Vorprüfung gelöscht. Diese können nicht wiederhergestellt werden.",
  },
  resume: {
    buttonText: "Vorprüfung fortsetzen",
  },
  faq: {
    tabName: "Häufige Fragen",
    title: "Häufige Fragen",
    items: [
      {
        headline: "Was ist Interoperabilität im EU-Kontext?",
        content: dedent`
          Interoperabilität bedeutet, dass Verwaltungen und öffentliche Einrichtungen in der EU zusammenarbeiten und Informationen austauschen können. So können digitale Dienstleistungen, wie z. B. das Beantragen von Dokumenten oder der Austausch von Gesundheitsdaten, über Länder- und Organisationsgrenzen hinweg einfach bereitgestellt werden.
          
          Das [European Interoperability Framework (EIF)](https://interoperable-europe.ec.europa.eu/collection/nifo-national-interoperability-framework-observatory/european-interoperability-framework-detail) legt hierfür Standards und Regeln fest, die sicherstellen, dass IT-Systeme in der EU miteinander kompatibel sind. Das macht es für Bürgerinnen und Bürger sowie Unternehmen leichter, öffentliche Dienste in der gesamten EU zu nutzen.
        `,
      },
      {
        headline: "Was bedeutet Interoperabilität in meinem Vorhaben?",
        content:
          "Wenn Gesetze und Regelungen die Interoperabilität berücksichtigen, fördern sie die Zusammenarbeit zwischen den EU-Mitgliedstaaten und ihren Verwaltungen. Einheitliche Standards sorgen dafür, dass digitale Dienste bürgerfreundlich, effizient und sicher sind. Gleichzeitig werden einheitliche Regeln geschaffen, die die grenzüberschreitende Zusammenarbeit in der EU erleichtern und eine harmonische Entwicklung der Rechtsvorschriften fördern.",
      },
      {
        headline:
          "Welche Rolle spielt der Digitalcheck bei interoperablen Regelungsvorhaben?",
        content: dedent`
          Der Digitalcheck begleitet Sie bei der Erarbeitung von digitaltauglichen und ab Januar 2025 interoperablen Regelungsvorhaben. Dieser Auftrag wurde dem Digitalcheck vom BMDS erteilt.

          Wenn Ihr Regelungsvorhaben Anforderungen an Interoperabilität beinhaltet, unterstützen wir Sie dabei, diese optimal umzusetzen. In diesem Fall wird das Digitalcheck-Team automatisch über das Ergebnis informiert, sobald Sie es per E-Mail absenden. Wir setzen uns dann mit Ihnen in Verbindung, um gemeinsam die weiteren Schritte zu planen und umzusetzen. Sollten Sie vorab Fragen haben, können Sie sich jederzeit direkt an uns wenden - telefonisch unter ${contact.mdPhoneLink()} oder per E-Mail an ${contact.mdMailToLink(contact.interoperabilityEmail, "Supportanfrage: digitalcheck.bund.de")}.
        `,
      },
      {
        headline: "Was ist Digitalbezug?",
        content: dedent`
          Digitalbezug im Kontext der Umsetzung bedeutet, dass ein Prozess zumindest teilweise durch ein IT-System abgebildet wird. Beispiele sind:
          - eine Reihe von Aufgaben mit einem bestimmten Ziel, zum Beispiel das Ausfüllen eines Formulars in ELSTER, um die Steuererklärung einzureichen,
          - die Abfrage von Daten aus einem Register oder
          - das Bereitstellen von Informationen auf einer Website.
        `,
      },
      {
        headline: "Warum digitaltaugliche Regelungen schreiben?",
        content: dedent`
          <p><strong>Digitaltaugliche Regelungen sparen Ressourcen</strong></p>
          <p>Eine gute digitale Umsetzung spart langfristig Zeit und sorgt dafür, dass Ziel und Wirkung des Vorhabens erreicht werden - aufseiten der Normadressatinnen und Normadressaten und aufseiten der Verwaltung.</p>

          <p><strong>Relevant für alle Regelungsvorhaben</strong></p>
          <p>Der Digitalcheck gilt für alle Regelungsvorhaben auf Bundesebene – Gesetze, Verordnungen und Verwaltungsvorschriften. Es fallen sowohl neue Vorhaben, als auch Änderungen an bestehenden Regelungen darunter.</p>
        `,
      },
      {
        headline: "Was ist, wenn ich mehrere Regelungen habe?",
        content:
          "Füllen Sie eine gemeinsame Vorprüfung für alle inhaltlich zusammenhängenden Regelungen eines Vorhabens aus. So viele wie nötig, so wenige wie möglich.",
      },
      {
        headline: "Kann ich das PDF für die Vorprüfung weiterhin verwenden?",
        content:
          "Sie können weiterhin das PDF-Dokument zur Vorprüfung verwenden, um den digitalen Aspekt Ihres Vorhabens zu bewerten. Bitte beachten Sie jedoch, dass die PDF-Version nicht geeignet ist, um Anforderungen zur Interoperabilität zu identifizieren.",
      },
    ],
  },
  nav: {
    ariaLabel: "Alle Fragen",
  },
  answerConflictHint: {
    euBezugHint: {
      title: "Widerspruch in Ihren Angaben",
      content: dedent`
        Ihre Angabe in Frage 3 (Datenaustausch):

        - **Datenaustausch findet nicht statt**

        Ihre Angabe in Frage 6 (Datenaustausch mit EU-Bezug):

        - **Datenaustausch findet statt**
        
        Bitte überprüfen Sie ihre Angaben.

        [Frage 3 zum Datenaustausch überprüfen](${vorpruefung_datenaustausch.path})
      `,
    },
  },
  questions: [
    {
      id: "it-system",
      path: vorpruefung_itSystem.path,
      title: "IT-System",
      positiveResult: "einer Anpassung oder Neuentwicklung einer IT-Lösung.",
      negativeResult: "keiner Anpassung oder Neuentwicklung einer IT-Lösung.",
    },
    {
      id: "verpflichtungen-fuer-beteiligte",
      path: vorpruefung_verpflichtungenFuerBeteiligte.path,
      title: "Verpflichtungen für Beteiligte",
      positiveResult:
        "einer Festlegung von Mitwirkungspflichten für Akteurinnen und Akteure.",
      negativeResult:
        "keiner Festlegung von Mitwirkungspflichten für Akteurinnen und Akteure.",
    },
    {
      id: "datenaustausch",
      path: vorpruefung_datenaustausch.path,
      title: "Datenaustausch",
      positiveResult: "einem Austausch von Daten.",
      negativeResult: "keinem Austausch von Daten.",
    },
    {
      id: "kommunikation",
      path: vorpruefung_kommunikation.path,
      title: "Digitale Kommunikation",
      positiveResult:
        "einer Interaktion zwischen Behörden und Bürgerinnen und Bürgern bzw. Unternehmen.",
      negativeResult:
        "keiner Interaktion zwischen Behörden und Bürgerinnen und Bürgern bzw. Unternehmen.",
    },
    {
      id: "automatisierung",
      path: vorpruefung_automatisierung.path,
      title: "Automatisierung",
      positiveResult:
        "einer Verbesserung der Umsetzung der Regelung durch die Automatisierung von Schritten.",
      negativeResult:
        "keiner Verbesserung der Umsetzung der Regelung durch die Automatisierung von Schritten.",
    },
    {
      id: "eu-bezug",
      path: vorpruefung_euBezug.path,
      title: "EU-Bezug",
      positiveResult:
        "einem Daten- und Informationsaustausch zwischen EU-Mitgliedstaaten.",
      negativeResult:
        "keinem Daten- und Informationsaustausch zwischen EU-Mitgliedstaaten.",
      resultHint: {
        unsureResult: `**Das können Sie tun:** Kontaktieren Sie uns unter ${contact.mdPhoneLink()} oder per E-Mail an ${contact.mdMailToLink(contact.interoperabilityEmail, "Supportanfrage: digitalcheck.bund.de")}. Wir unterstützen Sie gerne bei der Beantwortung dieser Frage.`,
      },
      resultTooltip: {
        positiveResult: "Bitte beachten Sie den oberen Hinweis.",
      },
      interoperability: true,
    },
  ] as TQuestion[],
};
