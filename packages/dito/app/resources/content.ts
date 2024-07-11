import type { TQuestion } from "routes/vorpruefung.$questionId/route";
import {
  PATH_ASSESSMENT,
  PATH_DOCUMENTATION_PDF,
  PATH_METHODS,
  PATH_METHODS_COLLECT_IT_SYSTEMS,
  PATH_METHODS_FIVE_PRINCIPALS,
  PATH_METHODS_RESPONSIBLE_ACTORS,
  PATH_METHODS_TASKS_PROCESSES,
  PATH_METHODS_TECHNICAL_FEASIBILITY,
  PATH_PRECHECK,
  PATH_RESULT,
} from "./staticRoutes";

export const siteMeta = {
  title: "Digitalcheck",
  description: "Digitaltaugliche Regelungsvorhaben erarbeiten",
};

export const header = {
  title: "Digitaltaugliche Gesetzgebung",
  contact: {
    msg: "Kontaktieren Sie uns:",
    number: "0151/40 76 78 39",
  },
  underConstruction:
    "Dieses Angebot befindet sich im Aufbau und wird auf Basis Ihrer Rückmeldung weiterentwickelt.",
};

export const landing = {
  title: "Digitaltaugliche Regelungsvorhaben erarbeiten",
  subtitle:
    "Heutzutage haben fast alle Regelungsvorhaben in der Umsetzung eine digitale Komponente. Hier erfahren Sie, welche Aspekte digitaler Umsetzung für Ihr Regelungsvorhaben wichtig sind und wie Sie eine reibungslose Umsetzung ermöglichen.",
  list: {
    title: "So gehen Sie vor:",
    items: [
      {
        headline: {
          text: "Vorprüfung: Digitalbezug einschätzen",
        },
        content:
          "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
        buttons: [
          {
            text: "Digitalbezug einschätzen",
            href: PATH_PRECHECK,
          },
        ],
      },
      {
        spacer: {
          text: "Bei positiver Vorprüfung:",
        },
        headline: {
          text: "Erarbeiten eines digitaltauglichen Regelungsvorhabens",
        },
        content: `Hier finden Sie passende Methoden und Werkzeuge, um Digitaltauglichkeit in Ihrer Regelung sicherzustellen.
        <br />
        [Zu den Hilfestellungen und Methoden](${PATH_METHODS})`,
      },
      {
        headline: {
          text: "Dokumentieren der Digitaltauglichkeit",
        },
        content: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen.
          <br />
          [Zur Dokumentation](${PATH_DOCUMENTATION_PDF})`,
      },
      {
        headline: {
          text: "Digitalcheck durch den NKR",
        },
        content:
          "Der NKR prüft ihr Vorhaben hinsichtlich der Berücksichtigung der Prinzipien digitaltauglicher Gesetzgebung. Bei Fragen wird der NKR auf Sie zukommen.",
      },
    ],
  },
  dataNotice: {
    headline: "Arbeitsstände werden nicht gespeichert.",
    content:
      "Wenn Sie eine Pause in der Erarbeitung machen möchten, kehren Sie einfach wieder an den Punkt zurück, an dem Sie aufgehört haben.",
  },
  summary: {
    title: "Zusammengefasst",
    items: [
      {
        headline: {
          text: "Was ist Digitaltauglichkeit?",
        },
        content: `Fast alle Regelungen werden mindestens zum Teil digital umgesetzt: Zum Beispiel eine Gesetzesänderung, mit der ein Papierantrag durch einen Online-Antrag ersetzt wird. Oder eine Verordnung, die Änderungen in den IT-Verfahren nachgelagerter Behörden erfordert.
<br />
<br />
Damit die digitale Umsetzung reibungslos klappt, muss die Regelung digitaltauglich gestaltet sein. Das heißt einerseits, dass der digitalen Umsetzung nichts im Wege steht, wie zum Beispiel das persönliche Einreichen von Dokumenten. Auf der anderen Seite soll aktiv gefördert werden, dass möglichst viele Schritte von Computern durchgeführt oder unterstützt werden.`,
      },
      {
        spacer: true,
        headline: {
          text: "Digitaltaugliche Regelungen sparen Ressourcen",
        },
        content: `Eine gute digitale Umsetzung spart langfristig Zeit und sorgt dafür, dass Ziel und Wirkung des Vorhabens erreicht werden: Auf Seiten der Normadressaten und -adressatinnen und auf Seiten der Verwaltung.`,
      },
      {
        spacer: true,
        headline: {
          text: "Alle Regelungsvorhaben sind betroffen",
        },
        content: `Der Digitalcheck gilt für alle Regelungsvorhaben (Gesetze, Verordnungen und Verwaltungsvorschriften), sowohl für neue Vorhaben als auch für Änderungen an bestehenden Regelungen.`,
      },
    ],
  },
  principals: {
    title: "5 Prinzipien für digitaltaugliche Gesetzgebung",
    content: `1. Prinzip 1: Digitale Kommunikation sicherstellen
2. Prinzip 2: Wiederverwendung von Daten und Standards ermöglichen
3. Prinzip 3: Datenschutz und Informationssicherheit gewährleisten
4. Prinzip 4: Klare Regelungen für eine digitale Ausführung finden
5. Prinzip 5: Automatisierung ermöglichen

[Details und Beispiele](${PATH_METHODS_FIVE_PRINCIPALS})`,
  },
};

export const feedbackBanner = {
  title: "Haben Sie Fragen oder Anmerkungen?",
  text: `Dieser Dienst ist im Aufbau. Wenn Ihnen etwas fehlt, oder etwas nicht funktioniert, kontaktieren Sie uns über [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de) oder [0151/40 76 78 39](tel:0151/40767839). Ihr Feedback trägt dazu bei, Informationen und Gestaltung der Webseite für alle Nutzenden zu verbessern.`,
};

const hintInvolved = {
  title: "Wer sind Beteiligte?",
  text: `Beteiligte sind in diesem Zusammenhang all diejenigen, die an der Umsetzung des Regelungsvorhabens beteiligt sind. Das können sowohl Vollzugsakteure als auch Betroffene sein.
    
Beispiele für Beteiligte sind:
- Bürgerinnen und Bürger,
- Einwohnende,
- Kommunen, die Verwaltung und Behörden, deren IT- oder Rechtsabteilungen,
- IT-Dienstleistende,
- Unternehmen und
- weitere Organisationen wie z.B. Vereine.`,
};

const stepPreCheckFinished = {
  headline: {
    text: "Vorprüfung: Der Digitalbezug wurde eingeschätzt",
  },
  isDisabled: true,
};

const stepNKR = {
  headline: {
    text: "Digitalcheck durch den NKR",
  },
  content: `Der NKR prüft ihr Vorhaben hinsichtlich der Berücksichtigung der Prinzipien digitaltauglicher Gesetzgebung. Bei Fragen wird der NKR auf Sie zukommen.
<br /><br />
Die für Ihr Haus zuständige Ansprechperson finden Sie hier: [normenkontrollrat.bund.de/Webs/NKR/DE/der-nkr/sekretariat/sekretariat_node.html](https://www.normenkontrollrat.bund.de/Webs/NKR/DE/der-nkr/sekretariat/sekretariat_node.html)

Damit ist der Digitalcheck für Sie beendet.`,
};

export const preCheck = {
  start: {
    title: "1. Vorprüfung: Digitalbezug einschätzen",
    // TODO: Konsequenzen + Umsetzung mitdenken
    subtitle:
      "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
    buttonText: "Digitalbezug einschätzen",
    info: {
      title: "Haben Sie mehr als eine Regelung in Ihrem Vorhaben?",
      text: "Wenn Sie mehrere Regelungen ändern, bündeln Sie diese als inhaltlich zusammenhängende Vorhaben, für die Sie jeweils eine Vorprüfung ausfüllen.",
    },
    summary: {
      title: "Zusammenfassung",
      items: [
        {
          headline: {
            text: "Beginnen Sie so früh wie möglich",
          },
          content:
            "Führen Sie die Vorprüfung zu Beginn Ihrer Arbeit an einem Regelungsvorhaben durch, das heißt: vor der Formulierung eines Regelungstextes.",
        },
        {
          headline: {
            text: "Was ist Digitalbezug?",
          },
          content:
            "Wir sprechen von digitaler Umsetzung, wenn ein Prozess zumindest teilweise von einem IT-System abgebildet wird. Dabei kann es sich um eine Reihe von Aufgaben mit einem bestimmten Ziel handeln, zum Beispiel das Ausfüllen eines Formulars in ELSTER, um die Steuererklärung einzureichen. Es kann sich auch um die Abfrage von Daten aus einem Register handeln. Oder um das Bereitstellen von Informationen auf einer Website.",
        },
      ],
    },
  },
  nextButton: "Übernehmen & weiter",
  answerOptions: {
    yes: "Ja",
    no: "Nein",
    unsure: "Ich bin unsicher",
  },
  questions: [
    {
      id: "it-system",
      title: "IT-System",
      question:
        "Führt das Regelungsvorhaben zur Anpassung oder Neuentwicklung eines IT-Systems?",
      positiveResult:
        "führt zu einer Anpassung oder Neuentwicklung eines IT-Systems.",
      negativeResult:
        "führt nicht zu einer Anpassung oder Neuentwicklung eines IT-Systems.",
      // text: "Praxisbeispiel: Eine Datenbank erfasst potentielle Schadstoffe in Lebensmitteln. Nun kommen neue Inhaltsstoffe dazu. Oder pro Inhaltsstoff müssen weitere Daten zur langfristigen Schädlichkeit erfasst werden. Dafür wird die Datenbank (das IT-System) angepasst.",
      hint: {
        title: "Was ist ein IT-System?",
        text: `IT-Systeme können eigene, spezialisierte Fachverfahren sein, mit denen bestimmte Aufgaben ausgeführt werden: Zum Beispiel das Übermitteln der Einkommenssteuererklärung mit ELSTER. Es können jedoch auch standardmäßig verfügbare Programme wie Word, Excel oder Outlook gemeint sein. 
      <br />
      <br />
      Einige IT-Systeme haben eine Benutzeroberfläche, in der manuell Daten eingegeben werden — wie in diesem Formular. In anderen kommunizieren Computer im Hintergrund untereinander, wenn zum Beispiel Daten abgerufen und an anderer Stelle verwendet werden.`,
      },
    },
    {
      id: "verpflichtungen-fuer-beteiligte",
      title: "Verpflichtungen für Beteiligte",
      question:
        "Beinhaltet das Regelungsvorhaben Verpflichtungen für Beteiligte?",
      positiveResult: "beinhaltet Verpflichtungen für Beteiligte.",
      negativeResult: "beinhaltet keine Verpflichtungen für Beteiligte.",
      hint: hintInvolved,
    },
    {
      id: "datenaustausch",
      title: "Datenaustausch",
      question:
        "Hat das Regelungsvorhaben einen Datenaustausch zur Folge? Kann eine Wiederverwendung von Daten die Umsetzung erleichtern?",
      positiveResult:
        "hat einen Datenaustausch zur Folge. Oder eine Wiederverwendung von Daten kann die Umsetzung erleichtern.",
      negativeResult:
        "hat keinen Datenaustausch zur Folge. Eine Wiederverwendung von Daten kann die Umsetzung nicht erleichtern.",
      // text: "Praxisbeispiel: Arbeitnehmende müssen ihr Gehalt in der Einkommenssteuererklärung angeben. Diese Information liegt der Sozialversicherung bereits vor. Andere Daten müssen erst erhoben werden.",
    },
    {
      id: "kommunikation",
      title: "Digitale Kommunikation",
      question:
        "Spielen Interaktion und/oder Kommunikation zwischen Beteiligten in der Umsetzung des Regelungsvorhabens eine Rolle?",
      positiveResult:
        "wird Interaktion und/oder Kommunikation zwischen Beteiligten zur Folge haben.",
      negativeResult:
        "wird keine Interaktion und/oder Kommunikation zwischen Beteiligten zur Folge haben.",
      hint: hintInvolved,
    },
    {
      id: "automatisierung",
      title: "Automatisierung",
      question:
        "Kann durch (Teil-)Automatisierung der Aufwand für Betroffene reduziert werden? Kann digitale Dokumentation die Umsetzung verbessern?",
      positiveResult:
        "kann den Aufwand für Betroffene durch (Teil-)Automatisierung reduzieren.",
      negativeResult:
        "kann den Aufwand für Betroffene nicht durch (Teil-)Automatisierung reduzieren.",
      // text: "Praxisbeispiel: Durch die Auszahlung einer Pauschale entfällt das Errechnen eines Leistungsanspruchs.",
      hint: hintInvolved,
    },
  ].map((question, index, questions) => ({
    // generate list from the questions such that each list has a path, a previous link and a next link
    ...question,
    url: `${PATH_PRECHECK}/${question.id}`,
    prevLink:
      index === 0
        ? PATH_PRECHECK
        : `${PATH_PRECHECK}/${questions[index - 1].id}`,
    nextLink:
      index === questions.length - 1
        ? PATH_RESULT
        : `${PATH_PRECHECK}/${questions[index + 1].id}`,
  })) as TQuestion[],

  result: {
    title: "Ergebnis der Vorprüfung",
    positive: {
      title: "Ihr Regelungsvorhaben hat Digitalbezug.",
      reasoningIntro: "Das Regelungsvorhaben...",
      actionButton: {
        text: "Einschätzung als PDF bekommen",
        href: PATH_ASSESSMENT,
      },
      nextSteps: {
        title: "So machen Sie weiter",
        steps: [
          stepPreCheckFinished,
          {
            headline: {
              text: "Digitaltaugliches Regelungsvorhaben erarbeiten",
            },
            content:
              "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
            buttons: [
              {
                text: "Zu den Hilfestellungen und Methoden",
                href: PATH_METHODS,
                size: "large" as const,
              },
            ],
          },
          {
            headline: {
              text: "Abschließende Dokumentation",
            },
            content: `Nach dem Ihr Regelungsvorhaben abgeschlossen ist, schicken Sie die Dokumentation an das Sekretariat des Normenkontrollrats. [Zur Dokumentation](${PATH_DOCUMENTATION_PDF})`,
          },
          stepNKR,
        ],
      },
    },
    unsure: {
      title: "Sie haben mehrere Aussagen mit “unsicher” beantwortet.",
      hint: "Bitte kontaktieren Sie den Digitalcheck-Support unter: [0151/40 76 78 39](tel:0151/40767839). Wir helfen Ihnen, die Vorprüfung auszufüllen.",
      unsureIntro: '**Folgende Fragen haben Sie mit "Unsicher" beantwortet:**',
      negativeIntro: '**Folgende Fragen haben Sie mit "Nein" beantwortet:**',
      actionButton: {
        text: "Vorprüfung wiederholen",
        href: PATH_PRECHECK,
      },
      nextStep: {
        title:
          "Sie können auch ohne Vorprüfung Digitaltauglichkeit im Regelungsvorhaben sicherstellen",
        text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
        link: {
          text: "Zu den Hilfestellungen und Methoden",
          href: PATH_METHODS,
          size: "large",
        },
      },
    },
    negative: {
      title: "Ihr Regelungsvorhaben hat keinen Digitalbezug.",
      reasoningIntro: "Das Regelungsvorhaben...",
      nextSteps: {
        title: "So machen Sie weiter",
        steps: [stepPreCheckFinished, stepNKR],
      },
    },
  },
};

export const assessment = {
  title: "Erhalten Sie die Einschätzung als PDF",
  subtitle:
    "Lassen Sie uns Ihre E-Mail-Adresse da und Sie bekommen eine **Kopie der Einschätzung des Digitalbezugs** per E-Mail zugestellt. Diese können Sie für ihre eigenen Unterlagen nutzen.",
  form: {
    formLegend: "Bitte erläutern Sie Ihre Einschätzung.",
    policyTitleLabel: "Arbeitstitel des Vorhabens",
    policyTitleRequired: "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    policyTitleTooLong: "Bitte wählen Sie einen kürzeren Titel.",
    reasonLabel: "Begründung",
    reasonRequired:
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    reasonTooLong: "Bitte geben Sie eine kürzere Begründung ein.",
    downloadPdfButton: {
      text: "Ergebnis der Vorprüfung als PDF herunterladen",
    },
    receiveEmailButton: {
      text: "Per E-Mail erhalten",
    },
  },
};

export const methods = {
  title: "2. Erarbeiten eines digitaltauglichen Regelungsvorhabens",
  subtitle:
    "Methoden und Hilfestellungen helfen ihnen die Digitaltauglichkeit des Regelungsvorhabens zu erarbeiten oder zu verbessern. Es gibt verschiedene Optionen, die für Sie als nächstes Sinn ergeben können.",
  steps: {
    items: [
      {
        spacer: { text: "Der sichere Einstieg in jede Regelung" },
        headline: { text: "Erfassen Sie den Ist-Zustand" },
        content: `Ein solides Verständnis über den Ist-Zustand ist ein sinnvoller und sicherer Einstieg. Tauschen Sie sich mit den umsetzenden Akteurinnen und Akteuren aus. Bei dieser Gelegenheit können Sie auch nach Problemen in der aktuellen Praxis fragen.
Wenn Sie in den Gesprächen nichts Neues mehr erfahren, haben Sie den Status Quo erfasst.

**Ein Austausch über die aktuelle Praxis darf auch während des Entwurfsprozesses stattfinden.**

Mit diesen Informationen sind Sie gut vorbereitet, um ... 
- Anforderungen für die neue Regelung zu erarbeiten,  
- Abstimmungsprozesse zwischen Bund, Ländern, umsetzenden Behörden und Dienstleistern zu navigieren, 
- in der formellen Beteiligung eine wirkungsvolle Umsetzung zu besprechen.`,
      },
      {
        background: "blue",
        headline: { text: "Zuständige Akteurinnen und Akteure auflisten" },
        content: `**Zeitaufwand:** ca. vier Stunden
<br />
<br />

Wenn Sie ein Regelungsvorhaben erstellen, ist es entscheidend, die **Zuständigkeiten der umsetzenden Akteurinnen und Akteure** zu kennen: Sie sind die Expertinnen und Experten für die Umsetzung in der Praxis.`,
        buttons: [
          {
            text: "Ansprechpersonen finden",
            href: PATH_METHODS_RESPONSIBLE_ACTORS,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Abläufe, Aufgaben und Zusammenhänge gemeinsam erfassen",
        },
        content: `**Zeitaufwand:** ca. sechs Stunden
<br />
**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren zusammen
<br />
<br />

Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die **aktuellen Rahmenbedingungen** verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie im vorigen Schritt identifiziert haben. In diesem Schritt müssen Sie noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den **Status Quo**.
`,
        buttons: [
          {
            text: "Aufgaben und Abläufe klären",
            href: PATH_METHODS_TASKS_PROCESSES,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "IT-Systeme gemeinsam erfassen",
        },
        content: `**Zeitaufwand:** ca. sechs Stunden
<br />
**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren
<br />
**Support:** Eine neutrale Drittmeinung erhalten Sie vom Digitalcheck-Support
<br />
<br />

Nutzen Sie das Fachwissen der Akteurinnen und Akteuren , um die verwendete IT-Infrastruktur für die im vorigen Schritt identifizierten Abläufe zu erfassen und zu verstehen.
`,
        buttons: [
          {
            text: "IT-Landschaft verstehen",
            href: PATH_METHODS_COLLECT_IT_SYSTEMS,
          },
        ],
      },
      {
        spacer: { text: "Praxiswissen einsetzen und auswirkungen verstehen" },
        headline: { text: "Entwickeln Sie eine digitaltaugliche Regelung" },
        content: `Mit einem guten Verständnis des Ist-Zustandes erarbeiten Sie nun Ihre Regelung. Jetzt geht es darum die Potentiale zur Digitalisierung zu finden und Hindernisse aus dem Weg zu räumen — eine gute digitale Umsetzung spart langfristig Zeit und Geld und erfüllt die heutigen Erwartungen der Betroffenen an den Staat.`,
      },
      {
        background: "blue",
        headline: {
          text: "Identifizieren Sie Digitalisierungspotential und -hindernisse",
        },
        content: `**Zeitaufwand:** Richtet sich nach Komplexität des Vorhabens
<br />
**Kollaborativ:** Text
<br />
**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen
<br />
<br />

Die fünf Prinzipien für digitaltaugliche Gesetzgebung decken unterschiedliche Aspekte der digitalen Umsetzung ab: Nutzen Sie die Erkenntnisse über den Ist-Zustand aus den vorigen Schritten, um mithilfe der Prinzipien die **Möglichkeiten des Digitalen auszuschöpfen und Hindernisse zu erkennen**. 
        `,
        buttons: [
          {
            text: "Fünf Prinzipien nutzen",
            href: PATH_METHODS_FIVE_PRINCIPALS,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Analysieren Sie die Auswirkungen auf IT-Systeme",
        },
        content: `**Zeitaufwand:** Richtet sich nach Komplexität des Vorhabens
<br />
**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren 
<br />
**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen
<br />
<br />

In diesem Schritt können Sie die Auswirkungen Ihres Regelungsvorhabens auf  bestehende und neue Abläufe und IT-Systeme analysieren. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der umsetzenden Akteurinnen und Akteure zurück.
        `,
        buttons: [
          {
            text: "IT-Auswirkungen prüfen",
            href: PATH_METHODS_TECHNICAL_FEASIBILITY,
          },
        ],
      },
      {
        spacer: { text: "Eine digitale, verwaltungsarme Regelung Schreiben" },
        headline: { text: "Verfassen Sie die Regelung" },
        content: `Nun folgt der gewohnte Schreibprozess sowie die formelle Beteiligung, Abstimmungen im Haus und zwischen den Ressorts. 

Die Erkenntnisse und Ergebnisse aus den vorigen Schritten helfen Ihnen dabei, ... 
- Ihren **Regelungstext zu strukturieren**, insbesondere in Abschnitten, die die Umsetzung betreffen,
- in der **Gesetzesbegründung** auf Probleme im Ist-Zustand einzugehen,
- den **Umsetzungsprozesse einfach besprechbar** zu machen in Abstimmungen anhand von Visualisierungen.`,
      },
      {
        background: "blue",
        headline: { text: "Schreiben Sie die Regelung" },
        content: `Nutzen Sie Ihren gewohnten Programme und Arbeitshilfen, um die Regelung zu schreiben — z. B. eNorm und das Handbuch der Rechtsförmigkeit.`,
      },
    ],
  },
  nextSteps: {
    title: "So machen Sie weiter",
    items: [
      {
        headline: {
          text: "Vorprüfung: der Digitalbezug wurde eingeschätzt",
        },
        isDisabled: true,
      },
      {
        headline: {
          text: "Erarbeiten eines digitaltauglichen Regelungsvorhabens",
        },
        isDisabled: true,
      },
      {
        headline: {
          text: "Dokumentieren der Digitaltauglichkeit",
        },

        content: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen. Der NKR prüft die Digitaltauglichkeit anhand dieser Dokumentation. Die Erkenntnisse der vorigen Schritte helfen Ihnen beim Ausfüllen.

[Zur Dokumentation](${PATH_DOCUMENTATION_PDF})`,
      },
      stepNKR,
    ],
  },
};

export const responsibleActors = {
  title: "Zuständige Akteurinnen und Akteure auflisten",
  subtitle: `Wenn Sie ein Regelungsvorhaben erstellen, ist es entscheidend, die Zuständigkeiten der umsetzenden Akteurinnen und Akteure zu kennen: Sie sind die Expertinnen und Experten für die Umsetzung in der Praxis und damit die wertvollsten Gesprächspartnerinnen und -partner für Digitaltauglichkeit.
  
  **Zeitaufwand:** ca. vier Stunden`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "I don't know!",
  },
  content: {
    label: "Anleitung",
    title: "Finden Sie konstruktive Gesprächspartnerinnen und -partner",
    text: `Beginnen Sie mit der Kontaktaufnahme oben in der Hierarchie, lassen Sie ggf. über Ihre Referats- und (Unter-)abteilungsleitung den Kontakt herstellen. Fragen Sie nach den Fachexpertinnen und -experten auf Arbeitsebene, hier steckt in der Regel das tiefste Praxiswissen.

- **Kommunen:** Bitten Sie Ansprechpersonen auf Landesebene um Kontakte und nutzen Sie  das gesammelte Wissen in den Kommunalen Spitzenverbänden. 
- **Behördenund Träger:** Nutzen Sie die offiziellen Wege der Häuser.
- **Unternehmen, Sozialpartner, weitere Organisationen:** Fragen Sie in Spitzenverbänden nach Ansprechpersonen für Ihren konkreten Anwendungsfall. 

Wenn Sie keine persönlichen Kontakte nutzen können, greifen sie auf Organigramme oder interne Datenbanken zu, z. B. das X500-Verzeichnis.`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/ebenen-auswaehlen-und-ansprechpersonen-sammeln.png", // TODO: Image doesn't exist yet
        alt: `Eine Excel-Tabelle mit dem Titel "Beteiligte Ebenen auswählen und Ansprechpersonen sammeln für [ARBEITSTITEL]" enthält Spalten für Name, Zuständigkeit, Akteursgruppe, Kontaktdaten und Bemerkungen. Der erste Eintrag listet als Beispiel "Maria Muster" als Referentin für das Statistische Bundesamt, zugehörig zur Akteursgruppe "Bund" mit ihren Kontaktdaten.`,
      },
      label: "Vorlage",
      title: "Beteiligte Ebenen auswählen und Ansprechpersonen sammeln",
      text: `Die Excelvorlage hilft Ihnen, die beteiligten Ebenen auszuwählen, Zuständigkeiten zu klären und hilfreiche Ansprechpersonen zu sammeln.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/assets/ansprechpersonen-sammeln.xlsx", // TODO: File doesn't exist yet...
        },
      ],
    },
  ],
  tip: {
    label: "Tipps",
    title: "Gespräche über die aktuelle Umsetzungspraxis",
    text: `- **Keine Sorge vor falscher Kontaktaufnahme:** Es kann nichts passieren, außer dass man Sie an die richtige Ansprechperson verweist.
    - **Persönliche Gespräche statt Schriftverkehr:** Bitten Sie um persönliche Gespräche bei der Kontaktaufnahme. Schriftlicher Austausch lädt zu Missverständnissen ein.  
    - **Der Austausch über den Ist-Stand ist sicher:** Nur Mut bei der Ansprache, über die aktuelle Umsetzung dürfen Sie immer sprechen.`,
  },
  nextStep: {
    label: "So geht es weiter:",
    title: "Aufgaben und Abläufe gemeinsam erfassen",
    text: `Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die **aktuellen Rahmenbedingungen** verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie identifiziert haben. Sie müssen noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den **Status Quo**.`,
    buttons: [
      { text: "Zum nächsten Schritt", href: PATH_METHODS_TASKS_PROCESSES },
    ],
  },
};

export const tasksProcesses = {
  title: "Aufgaben und Abläufe gemeinsam erfassen",
  subtitle: `Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die aktuellen Abläufe verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie im vorigen Schritt identifiziert haben. In diesem Schritt müssen Sie noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den Status Quo.
  
  **Zeitaufwand:** ca. sechs Stunden 
  **Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren zusammen`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "I don't know!",
  },
  content: {
    label: "Anleitung",
    title: "Erfassen Sie die aktuellen Abläufe",
    text: `Listen Sie auf, welche Schritte und Aufgaben aktuell erfüllt werden, damit das Ziel des Vorhabens erreicht wird, und wie diese im Zusammenhang stehen.

Der Überblick lohnt sich auch bei scheinbar einfachen Abläufen: 
- Fehlende Verbindungen oder unerwartete Abhängigkeiten sichtbar.
- Sie erfahren, auf welchen bestehenden Abläufen Sie aufbauen können.

Die Frage, die Sie sich und Ihren Ansprechpersonen stellen können, lautet: „Wer will was wann von wem?”`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/einfache-ablaeufe-und-aufgaben-erfassen.png", // TODO: Image doesn't exist yet
        alt: `Ein Flussdiagramm mit dem Titel "Beispielprozess-Ablauf 'Einkommensteuer-Erklärung durchführen'". Auf der linken Seite ist ein gezeichnetes Gebäude und daneben ein Figur, sie sind als "Akteurin oder Akteur" beschriftet. Als Beispiel steht darunter "Finanzämter". Diese senden Daten zur zentralen Speicherung und Auswertung, dargestellt durch einen Pfeil, der mit "Arbeitsprozess" beschriftet ist. Rechts steht noch einmal das Gebäude mit der Person daneben, beschriftet als "Adressatin oder Adressat". Als Beispiel ist "Bundeszentralamt für Steuern" eingetragen.`,
      },
      label: "Vorlage",
      title: "Einfache Abläufe und Aufgaben erfassen",
      text: `1. Sammeln Sie [Akteurinnen und Akteure](${PATH_METHODS_RESPONSIBLE_ACTORS}), die an der Umsetzung beteiligt sind, und tragen Sie diese auf der linken Seite an. (“Wer”)
2. Rechts tragen Sie die Adressatinnen und Adressaten ein. (“will wann was”)
3. In die Mitte schreiben Sie die verbindenden Aufgaben. (“von wem”)

Die Vorlage dient der Orientierung und kann angepasst werden. Ein Beispiel: Adressatinnen und Adressaten, die einen Antrag stellen, können auf der linken Seite stehen, die entsprechende Behörde steht dann rechts.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/assets/ablaeufe-und-aufgaben.pdf", // TODO: File doesn't exist yet...
        },
      ],
    },
    {
      image: {
        src: "/assets/images/visualisierungsbeispiele-fuer-komplexe-ablaeufe.png", // TODO: Image doesn't exist yet
        alt: `Ein Flussdiagramm mit der Überschrift "Rulemap § 9b 2023". Es zeigt die verschiedenen Bedingungen, unter denen eine Steuerentlastung gewährt wird, und ihre Abhängigkeiten.`,
      },
      label: "Vorlage",
      title: "Visualisierungsbeispiele für komplexe Abläufe",
      text: `Komplexe Abläufe können schwieriger zu durchdringen sein und erfordern daher eine detaillierte und strukturierte Herangehensweise. Beginnen Sie mit der groben Skizzierung der wichtigsten Abläufe und unterteilen Sie diese anschließend in spezifische Aufgaben.  Auf der [Werkzeugfinder-Seite des BMI](https://visualisieren.digitalcheck.bund.de/) finden Sie Anleitungen für verschiedene Visualisierungsmethoden. 

Sie können sich auch von den [Visualisierungen im Entwurf des Stromsteuergesetzes](https://dserver.bundestag.de/brd/2024/0232-24.pdf#page=134) inspirieren lassen, die im Rahmen des Digitalchecks entstanden sind. Der Gesetzestext wurde als Rulemap visualisiert, der Umsetzungsprozess als Flussdiagramm. `,
    },
  ],
  tip: {
    label: "Tipps",

    title: "Wertschätzend und auf Ziele fokussiert vorgehen",
    text: `- **Regelungsziel im Fokus:** Interessenkonflikte treten in den Hintergrund, wenn das Regelungsziel im Sinne der Normadressaten im Mittelpunkt steht — dahinter kann sich meistens vereint werden. 
- **Hürden und Anforderungen wertschätzen:** Sicherlich werden Sie nicht alle Wünsche und Anforderungen umsetzen können. Bedanken Sie sich für den Input, kommunizieren Sie, was nicht eingearbeitet wird und erläutern Sie die Gründe.`,
  },
  support: {
    label: "Unterstützungsangebot",

    title: "Visualsierungen gemeinsam erstellen",
    text: `Der Digitalcheck-Support unterstützt Sie bei der Visualsierung von Abläufen. Wir helfen Ihnen gerne, insbesondere bei komplexen Abläufen. 

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:0151/40767839) oder [support@digitalcheck.bund.de](mailto:support@digitalcheck.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
  },
  nextStep: {
    label: "So geht es weiter:",
    title: "IT-Systeme erfassen",
    text: `Nutzen Sie das Fachwissen der Akteurinnen und Akteuren , um die verwendete IT-Infrastruktur für die identifizierten Abläufe zu erfassen und zu verstehen.`,
    buttons: [
      { text: "Zum nächsten Schritt", href: PATH_METHODS_COLLECT_IT_SYSTEMS },
    ],
  },
};

export const collectITSystems = {
  title: "IT-Systeme gemeinsam erfassen",
  subtitle: `Nutzen Sie das Fachwissen der zuständigen Akteurinnen und Akteuren, um die verwendete IT-Infrastruktur für die im vorigen Schritt identifizierten Abläufe zu erfassen und zu verstehen.
  
  **Zeitaufwand:** ca. sechs Stunden 
  **Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren 
  **Support:** Eine neutrale Drittmeinung erhalten Sie vom Digitalcheck-Support`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "I don't know!",
  },
  content: {
    label: "Anleitung",
    title: "So erfassen Sie die IT-Systeme",
    text: `Dokumentieren Sie die verwendeten IT-Systeme mit ihren Funktionalitäten, Schnittstellen und Anforderungen. 

Ein Überblick über die IT-Landschaft hilft Ihnen dabei, 
- alle relevanten Aspekte aufzuschlüsseln und potentiell blinde Flecken zu identifizieren,
- auf bestehende Standards und Prozesse aufzusetzen,
- oder Potential für Vereinheitlichung zu nutzen.`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/it-systeme-erfassen.png", // TODO: Image doesn't exist yet
        alt: `Eine Excel-Tabelle mit dem Titel "IT-Systeme erfassen für [ARBEITSTITEL]", die Spalten sind Name des IT-Systems, Funktionalitäten, Nutzende, Schnittstellen und Zuständigkeit. Als Beispiel ist ELSTER eingetragen, das zur Übermittlung der Steuererklärung von Bürgerinnen und Bürgern oder Unternehmen zu den Sachbearbeiterinnen und Sachbearbeitern der Finanzämter dienst. Es gibt unter Anderem eine Schnittstelle zu einem IT-System für Kapitalertragssteuer und Kirchensteuer. Für die Entwicklung ist das Bayerische Landesamt für Steuern zuständig.`,
      },
      label: "Vorlage",

      title: "IT-Systeme erfassen",
      text: `Nutzen Sie die Vorlage, um die IT-Systeme systematisch und detailliert zu dokumentieren. Sie müssen nicht selbst über das Wissen verfügen: Fragen Sie die zuständigen Akteurinnen und Akteure und ziehen Sie ggf. neutrale IT-Expertise hinzu.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/assets/it-systeme-erfassen.xlsx", // TODO: File doesn't exist yet...
        },
      ],
    },
  ],
  support: {
    label: "Unterstützungsangebot",

    title: "IT-Wissen einfach erklärt",
    text: `Der Digitalcheck-Support unterstützt Sie mit IT-Beratung, um Erkenntnisse zu erläutern und für Ihre Regelung zu nutzen, z. B. durch IT-Hintergrundwissen zu Schnittstellen. Jede Frage ist berechtigt — jede verstandene Antwort wird die Regelung digitaltauglicher machen. 

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:0151/40767839) oder [support@digitalcheck.bund.de](mailto:support@digitalcheck.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
  },
  nextStep: {
    label: "So geht es weiter:",

    title: "Identifizieren Sie Digitalisierungspotential und -hindernisse",
    text: `Mit einem guten Verständnis des Ist-Zustandes erarbeiten Sie nun Ihre Regelung. Die fünf Prinzipien für digitaltaugliche Gesetzgebung decken unterschiedliche Aspekte der digitalen Umsetzung ab: Nutzen Sie die Erkenntnisse über den Ist-Zustand, um mithilfe der Prinzipien die Möglichkeiten des Digitalen auszuschöpfen und Hindernisse zu erkennen.`,
    buttons: [
      { text: "Zum nächsten Schritt", href: PATH_METHODS_FIVE_PRINCIPALS },
    ],
  },
};

export const fivePrincipals = {
  title: "Fünf Prinzipien für digitaltaugliche Gesetzgebung",
  principals: [
    {
      label: "Prinzip 1",
      title: "Digitale Kommunikation sicherstellen",
      content: `### Darum ist das wichtig

Bürgerinnen und Bürger, Mitarbeitende in Unternehmen, weiteren Organisationen und der Verwaltung sind meist an digitale Kommunikation gewöhnt. In der Verwaltung und den Behörden erlaubt eine durchgehend digitale Dokumentation, Bearbeitung und ggf. Prüfung eine effizientere Bearbeitung.

Digitale Kommunikation sollte immer bedarfsorientiert und inklusiv sein — in bestimmten Fällen kann z. B. ergänzend auch die Schriftform sinnvoll sein, sofern eine digitale Weiterverarbeitung sichergestellt ist.
<br />
<br />
<br />
### Tipps für Ihr Regelungsvorhaben

- Wählen Sie Formulierungen, die den Einsatz von unterschiedlichen Medien, Technologien und Verfahren ermöglichen.
- Sollten Sie technologische Lösungen festschreiben, ermöglichen Sie den Einsatz von offenen Technologien, so sorgen Sie für Transparenz und Wiederverwendbarkeit.
- Ersetzen oder ergänzen Sie Schriftformerfordernisse und analoge Nachweispflichten. Prüfen Sie etwa, ob die Textform ausreichend ist und ermöglichen Sie die digitale Bearbeitung.
- Vermeiden Sie Medienbrüche. Diese können z. B. durch visuelle Darstellung des Vollzugs, wie Flussdiagramme, erkennbar werden.
- Erfüllen Sie Anforderungen der Barrierefreiheit und beachten Sie die Bedarfe unterschiedlicher Personengruppen.`,
    },
    {
      label: "Prinzip 2",
      title: "Wiederverwendung von Daten und Standards ermöglichen",
      content: `### Darum ist das wichtig

Häufig sind Daten von Personen oder Organisationen in verschiedenen Prozessen relevant. Das heißt, dass die Daten, die für Ihr Regelungsvorhaben benötigt werden, an anderer Stelle bereits vorliegen könnten. Sie sollten wiederverwendet werden, damit Bürgerinnen und Bürger oder Unternehmen Daten kein weiteres Mal angeben müssen und Verfahren vereinfacht werden. Auch die Wiederverwendung von Open-Source-Software, Standards oder sogar einzelner Design- oder Software-Komponenten vereinfacht Verfahren und spart Ressourcen.
<br />
<br />
<br />
### Tipps für Ihr Regelungsvorhaben

Recherchieren Sie für Ihr Regelungsvorhaben relevante bestehende Standards, Komponenten, Richtlinien, Verfahren zur Datenerfassung, Datenaustauschverfahren (Once-Only-Prinzip) sowie Register und weitere Quellen. Erste Anhaltspunkte finden Sie zum Beispiel auf:
- der Verwaltungsdaten-Informationsplattform: [verwaltungsdaten-informationsplattform.de](https://verwaltungsdaten-informationsplattform.de)
- der Registerlandkarte: [registerlandkarte.de](https://registerlandkarte.de)
- der Open-Source-Plattform der Verwaltung: [opencode.de](https://opencode.de)`,
    },
    {
      label: "Prinzip 3",
      title: "Datenschutz und Informationssicherheit gewährleisten",
      content: `### Darum ist das wichtig

Datenschutz und Informationssicherheit sind zentrale Voraussetzungen für praxistaugliche Digitalisierung — frühzeitig mitgedacht können Bedürfnisse von Betroffenen auf einfache Weise mit Daten- und Informationssicherheit vereinbart werden. Das Regelungsvorhaben soll eine datenschutzkonforme Umsetzung ermöglichen: Vor der Erhebung von Daten muss definiert werden, welche Daten zu welchem Zweck benötigt und wie sie geschützt werden.
<br />
<br />
<br />
### Tipps für Ihr Regelungsvorhaben

- Beteiligen Sie frühzeitig Expertinnen und Experten für Datenschutz und Informationssicherheit, um datenschutzkonforme Regelungen zu schreiben. Anhaltspunkte dafür geben auch geltende Richtlinien und Ausführungsbestimmungen z.B. vom BSI.
- Schaffen Sie die Rechtsgrundlage, um alle benötigten Daten zu erfassen und zu verarbeiten.
- Berücksichtigen Sie die finanziellen und personellen Ressourcen, die für die Umsetzung der Vorgaben der Informationssicherheit nötig sind.`,
    },
    {
      label: "Prinzip 4",
      title: "Klare Regelungen für eine digitale Ausführung finden",
      content: `### Darum ist das wichtig

Durch eindeutige und klare Formulierungen können die Regelungen verständlich dargestellt und die digitale Umsetzung erleichtert werden. Komplizierte, schwer verständliche Regelungskonstrukte erschweren eine digitale Ausführung.
<br />
<br />
<br />
### Tipps für Ihr Regelungsvorhaben

- Formulieren Sie die Texte Ihres Regelungsvorhaben so, dass es in der Umsetzung in Auf- gaben und chronologische Schritte übersetzt werden kann.
- Formulieren Sie klare Entscheidungsstrukturen. Nutzen Sie dafür eindeutige Kriterien und eine kohärente und logische Systematik. Ausnahmen sind klar gekennzeichnet. Testen Sie die Verständlichkeit mit den Personen, die an der Umsetzung beteiligt sind.
- Versuchen Sie, Rechtsbegriffe zu harmonisieren. Verwenden Sie definierte Rechtsbegriffe aus Ihrem Rechtsbereich. Auslegungen verhindern eine einheitliche Umsetzung.`,
    },
    {
      label: "Prinzip 5",
      title: "Automatisierung ermöglichen",
      content: `### Darum ist das wichtig

Digitale Lösungen zu erstellen, ist zunächst aufwändig. Die “Duplikation” oder Skalierung kostet jedoch (fast) nichts. Daher ist es personell und wirtschaftlich sinnvoll, sich wiederholende Schritte, Prozesse oder Vorgehen zu automatisieren. Ein Regelungsvorhaben, das Ermessensspielraum lässt, kann nicht vollständig automatisiert werden: Soweit es dem Regelungsziel dient, sollte darauf verzichtet werden. Dadurch entstehen zeitliche und finanzielle Freiräume für Fälle, die eine gesonderte Auseinandersetzung benötigen.
<br />
<br />
<br />
### Tipps für Ihr Regelungsvorhaben

- Schaffen Sie die rechtlichen Möglichkeiten für automatisierte und/oder antragslose Verfahren. Prüfen Sie z. B. die Möglichkeit von Pauschalen.
- Formulieren Sie klare Entscheidungsstrukturen. Nutzen Sie dafür eindeutige Kriterien und eine kohärente und logische Systematik. Beziehen Sie IT-Expertise mit ein.
- Versuchen Sie, Rechtsbegriffe zu harmonisieren. Verwenden Sie definierte Rechtsbegriffe aus Ihrem Rechtsbereich. Auslegungen verhindern die vollständige Automatisierung von Umsetzungsprozessen.`,
    },
  ],
};

export const technicalFeasibility = {
  title: "Technische Umsetzbarkeit sicherstellen",
  subtitle: `Analyisieren Sie die Auswirkungen Ihres Regelungsvorhabens auf bestehende und neue Abläufe und IT-Systeme. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der zuständigen Akteurinnen und Akteure zurück und holen Sie sich Hilfe von neutralen IT-Expertinnen und -Experten. 
 
**Zeitaufwand:** Richtet sich nach Komplexität des Vorhabens
**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren 
**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen `,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "I don't know!",
  },
  content: {
    label: "Anleitung",
    title: "Verstehen Sie die Auswirkungen auf IT-Systeme",
    text: `Vergleichen Sie gemeinsam mit den zuständigen [Akteurinnen und Akteuren](${PATH_METHODS_RESPONSIBLE_ACTORS}) das geplante Vorhaben mit den Möglichkeiten der bestehenden IT-Systeme. Überprüfen Sie die Informationen mithilfe neutraler IT-Expertinnen und -Experten. 

So erfahren Sie 
- welche IT-Systeme für Ihr Vorhaben verwendet werden können,
- und an welchen Stellen Änderungen nötig sind.

**Sie müssen nicht alles allein bewältigen:** Unterstützung bekommen Sie etwa vom Digitalcheck-Support ([0151/40 76 78 39](tel:0151/40767839) oder [support@digitalcheck.bund.de](mailto:support@digitalcheck.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)) `,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/aspekte-technischer-umsetzbarkeit.png", // TODO: Image doesn't exist yet
        alt: ``, // TODO: Alt text
      },
      label: "Vorlage",
      title: "Gesprächsleitfaden: Aspekte technischer Umsetzbarkeit",
      text: `Besprechen Sie die Fragen im Schaubild gemeinsam mit den IT-Expertinnen und Experten in der Umsetzung. Multidisziplinäre Zusammenarbeit ist hier der Schlüssel.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/assets/aspekte-technischer-umsetzbarkeit.pdf", // TODO: File doesn't exist yet...
        },
      ],
    },
  ],
  tip: {
    label: "Tipps",
    title: "Gespräche über IT-Anpassungen",
    text: `- **Aufwand verstehen:** Fragen Sie nach dem Aufwand für IT-Anpassungen. Lassen Sie sich die Details erklären, bis Sie die Aufwände nachvollziehen können. So werden Sie selbst sprechfähig.
- **Fokus auf das Regelungsziel:** Gehen Sie konstruktiv und mit dem Regelungsziel im Fokus in Gespräche. Veränderungen in der IT bedeuten organisatorischen und finanziellen Aufwand, was die Lösungsfindung erschweren kann.`,
  },
  support: {
    label: "Unterstützungsangebot",
    title: "Die technische Umsetzung gemeinsam durchdenken",
    text: `Wenn die technischen Anforderungen zu komplex werden, unterstützt Sie der Digitalcheck-Support. Wir helfen als neutraler Akteur dabei, 
- die **technische Umsetzung** im Detail zu durchdenken und Nutzerfreundlichkeit, Datenverwendung und IT-Sicherheit zu beachten,
- als **neutrale Moderation** in Gesprächen mit zuständigen Akteurinnen und Akteuren, um potentielle Interessenkonflikte durch Fachlichkeit zu entschärfen,
- **Erkenntnisse visuell** aufzubereiten – das ist die beste Grundlage für interne und externe Beteiligungsprozesse,
- die **Aussagen externer Dienstleister** zu reflektieren: Wirtschaftlichkeit kann eine Motivation für aufwändige Lösungen sein.

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:0151/40767839) oder [support@digitalcheck.bund.de](mailto:support@digitalcheck.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
  },
  nextStep: {
    label: "So geht es weiter:",
    title:
      "Verfassen Sie den Regelungsentwurf und dokumentieren Sie Ihre Entscheidungen",
    text: `Die gesammelten Erkenntnisse und Ergebnisse helfen Ihnen dabei, Aspekte der Digitaltauglichkeit in Ihrem Regelungsentwurf zu berücksichtigen. Diese Entscheidungen dokumentieren Sie in einem Fragebogen.`,
    buttons: [{ text: "Zu den Methoden und Werkzeugen", href: PATH_METHODS }],
  },
};

export const imprint = {
  title: "Impressum",
  content: `Demnächst verfügbar.`,
};

export const accessibility = {
  title: "Barrierefreiheit",
  content: `Demnächst verfügbar.`,
};

export const privacy = {
  title: "Datenschutzerklärung",
  content: `Demnächst verfügbar.`,
};
