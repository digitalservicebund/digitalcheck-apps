import type { TQuestion } from "routes/vorpruefung.$questionId/route";
import {
  PATH_ASSESSMENT,
  PATH_METHODS,
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
        [Zu den Hilfestellungen und Methoden](/methoden)`,
      },
      {
        headline: {
          text: "Dokumentieren der Digitaltauglichkeit",
        },
        content: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen.
          <br />
          [Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)`,
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

[Details und Beispiele](/fuenf-prinzipien)`,
  },
};

export const feedbackBanner = {
  title: "Haben Sie Fragen oder Anmerkungen?",
  text: `Dieser Dienst ist im Aufbau. Wenn Ihnen etwas fehlt, oder etwas nicht funktioniert, kontaktieren Sie uns über digitalcheck@digitalservice.bund.de oder <a href="tel:0151/40 76 78 39">0151/40 76 78 39</a>. Ihr Feedback trägt dazu bei, Informationen und Gestaltung der Webseite für alle Nutzenden zu verbessern.`,
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

const stepNKR = {
  headline: {
    text: "Schicken Sie die Vorprüfung an das Sekretariat des NKR",
  },
  content: `Der NKR prüft gemäß seines Auftrags die Nachvollziehbarkeit der Digitaltauglichkeit Ihres Regelungsentwurfes anhand der Fragen, die Sie in der Einschätzung beantwortet haben. Gegebenenfalls wird Ihre Ansprechperson im NKR-Sekretariat mit Fragen oder Anregungen auf Sie zukommen.

Die für Ihr Haus zuständige Ansprechperson finden Sie hier: www.normenkontrollrat.bund.de/Webs/NKR/DE/der-nkr/sekretariat/sekretariat_node.html

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
      Einige IT-Systeme haben eine Benutzeroberfläche, in der manuell Daten eingegeben werden – wie in diesem Formular. In anderen kommunizieren Computer im Hintergrund untereinander, wenn zum Beispiel Daten abgerufen und an anderer Stelle verwendet werden.`,
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
    positive: "Ihr Regelungsvorhaben hat Digitalbezug.",
    negative: "Ihr Regelungsvorhaben hat keinen Digitalbezug.",
    unsure: "Sie haben mehrere Aussagen mit “unsicher” beantwortet.",
    unsureHint:
      'Bitte kontaktieren Sie den Digitalcheck-Support unter: <a href="tel:0151/40 76 78 39">0151/40 76 78 39</a>. Wir helfen Ihnen, die Vorprüfung auszufüllen.',
    receivePdfButton: {
      text: "Einschätzung als PDF bekommen",
      href: PATH_ASSESSMENT,
    },
    repeatPreCheckButton: {
      text: "Vorprüfung wiederholen",
      href: PATH_PRECHECK,
    },
    reasonIntro:
      "Digitalbezug liegt vor, wenn die Umsetzung des Regelungsvorhabens voraussichtlich ...",
    nextStepsPositive: {
      title: "So machen Sie weiter",
      steps: [
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
            },
          ],
        },
        {
          headline: {
            text: "Abschließende Dokumentation",
          },
          content:
            "Nach dem Ihr Regelungsvorhaben abgeschlossen ist, schicken Sie die Dokumentation an das Sekretariat des Normenkontrollrats. [Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)",
        },
        stepNKR,
      ],
    },
    boxUnsure: {
      title:
        "Sie können auch ohne Vorprüfung Digitaltauglichkeit im Regelungsvorhaben sicherstellen",
      text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
      link: {
        text: "Zu den Hilfestellungen und Methoden",
        href: PATH_METHODS,
      },
    },
    nextStepsNegative: {
      title: "So machen Sie weiter",
      step: stepNKR,
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
        content: `**Zeit:** ca. vier Stunden

Wenn Sie ein Regelungsvorhaben erstellen, ist es entscheidend, die **Zuständigkeiten der umsetzenden Akteurinnen und Akteure** zu kennen: Sie sind die Expertinnen und Experten für die Umsetzung in der Praxis.`,
        buttons: [
          {
            text: "Ansprechpersonen finden",
            href: PATH_METHODS,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Abläufe, Aufgaben und Zusammenhänge gemeinsam erfassen",
        },
        content: `**Zeit:** ca. sechs Stunden

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren zusammen

Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die **aktuellen Rahmenbedingungen** verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie im vorigen Schritt identifiziert haben. In diesem Schritt müssen Sie noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den **Status Quo**.
`,
        buttons: [
          {
            text: "Aufgaben und Abläufe klären",
            href: PATH_METHODS,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "IT-Systeme gemeinsam erfassen",
        },
        content: `**Zeit:** ca. sechs Stunden

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren

**Support:** Eine neutrale Drittmeinung erhalten Sie vom Digitalcheck-Support

Nutzen Sie das Fachwissen der Akteurinnen und Akteuren , um die verwendete IT-Infrastruktur für die im vorigen Schritt identifizierten Abläufe zu erfassen und zu verstehen.
`,
        buttons: [
          {
            text: "IT-Landschaft verstehen",
            href: PATH_METHODS,
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
        content: `**Zeit:** Richtet sich nach Komplexität des Vorhabens

**Kollaborativ:** Text

**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen

Die fünf Prinzipien für digitaltaugliche Gesetzgebung decken unterschiedliche Aspekte der digitalen Umsetzung ab: Nutzen Sie die Erkenntnisse über den Ist-Zustand aus den vorigen Schritten, um mithilfe der Prinzipien die **Möglichkeiten des Digitalen auszuschöpfen und Hindernisse zu erkennen**. 
        `,
        buttons: [
          {
            text: "Fünf Prinzipien nutzen",
            href: PATH_METHODS,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Analysieren Sie die Auswirkungen auf IT-Systeme",
        },
        content: `**Zeit:** Richtet sich nach Komplexität des Vorhabens

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren 

**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen

In diesem Schritt können Sie die Auswirkungen Ihres Regelungsvorhabens auf  bestehende und neue Abläufe und IT-Systeme analysieren. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der umsetzenden Akteurinnen und Akteure zurück.
        `,
        buttons: [
          {
            text: "IT-Auswirkungen prüfen",
            href: PATH_METHODS,
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
        content: `Nutzen Sie Ihren gewohnten Programme und Arbeitshilfen, um die Regelung zu schreiben – z. B. eNorm und das Handbuch der Rechtsförmigkeit.`,
      },
    ],
  },
  nextSteps: {
    title: "So machen Sie weiter",
    items: [
      {
        headline: {
          text: "Vorprüfung: der Digitalbezug wurde eingeschätzt",
          className: "opacity-50",
        },
      },
      {
        headline: {
          text: "Erarbeiten eines digitaltauglichen Regelungsvorhabens",
          className: "opacity-50",
        },
      },
      {
        headline: {
          text: "Dokumentieren der Digitaltauglichkeit",
        },

        content: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen. Der NKR prüft die Digitaltauglichkeit anhand dieser Dokumentation. Die Erkenntnisse der vorigen Schritte helfen Ihnen beim Ausfüllen.

[Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)`,
      },
      {
        headline: {
          text: "Digitalcheck durch den NKR",
        },

        content: `Der NKR prüft ihr Vorhaben hinsichtlich der Berücksichtigung der Prinzipien digitaltauglicher Gesetzgebung. Bei Fragen wird der NKR auf Sie zukommen.

Die für Ihr Haus zuständige Ansprechperson finden Sie hier: [normenkontrollrat.bund.de/Webs/NKR/DE/der-nkr/sekretariat/sekretariat_node.html](normenkontrollrat.bund.de/Webs/NKR/DE/der-nkr/sekretariat/sekretariat_node.html)

Damit ist der Digitalcheck für Sie beendet.`,
      },
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

Digitale Kommunikation sollte immer bedarfsorientiert und inklusiv sein – in bestimmten Fällen kann z. B. ergänzend auch die Schriftform sinnvoll sein, sofern eine digitale Weiterverarbeitung sichergestellt ist.
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
- der Open Source Plattform der Verwaltung: [opencode.de](https://opencode.de)`,
    },
    {
      label: "Prinzip 3",
      title: "Datenschutz und Informationssicherheit gewährleisten",
      content: `### Darum ist das wichtig

Datenschutz und Informationssicherheit sind zentrale Voraussetzungen für praxistaugliche Digitalisierung – frühzeitig mitgedacht können Bedürfnisse von Betroffenen auf einfache Weise mit Daten- und Informationssicherheit vereinbart werden. Das Regelungsvorhaben soll eine datenschutzkonforme Umsetzung ermöglichen: Vor der Erhebung von Daten muss definiert werden, welche Daten zu welchem Zweck benötigt und wie sie geschützt werden.
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
