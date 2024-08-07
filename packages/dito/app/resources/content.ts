import type { TMethodPage } from "routes/methoden_.$subPage";
import type { TQuestion } from "routes/vorpruefung.$questionId/route";
import {
  ROUTE_A11Y,
  ROUTE_ASSESSMENT,
  ROUTE_DOCUMENTATION,
  ROUTE_DOCUMENTATION_STATIC_PDF,
  ROUTE_LANDING,
  ROUTE_METHODS,
  ROUTE_METHODS_COLLECT_IT_SYSTEMS,
  ROUTE_METHODS_FIVE_PRINCIPLES,
  ROUTE_METHODS_RESPONSIBLE_ACTORS,
  ROUTE_METHODS_TASKS_PROCESSES,
  ROUTE_METHODS_TECHNICAL_FEASIBILITY,
  ROUTE_PRECHECK,
  ROUTE_PRIVACY,
  ROUTE_RESULT,
  ROUTE_SUPPORT,
} from "./staticRoutes";

export const siteMeta = {
  title: "Digitalcheck: Digitaltaugliche Regelungen erarbeiten",
  description:
    "Hier erfahren Sie als Legistin oder Legist, was Digitaltauglichkeit für Ihr Regelungsvorhaben bedeutet, wie Sie eine reibungslose Umsetzung des Vorhabens ermöglichen und welche Unterlagen Sie benötigen.",
};

export const header = {
  title: "Digitalcheck",
  contact: {
    msg: "Kontaktieren Sie den Support",
    number: "0151/40 76 78 39",
  },
  underConstruction:
    "Dieses Angebot befindet sich im Aufbau und wird auf Basis Ihrer Rückmeldung weiterentwickelt.",
};

const stepNKR = {
  headline: {
    text: "Prüfung durch den NKR",
  },
  content: `Der NKR (Nationaler Normenkontrollrat) prüft Ihr Vorhaben hinsichtlich der Berücksichtigung der Prinzipien digitaltauglicher Gesetzgebung. Bei Fragen wird der NKR auf Sie zukommen.`,
};
export const steps = {
  preCheck: {
    headline: {
      text: "Vorprüfung: Digitalbezug einschätzen",
    },
    content:
      "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
    buttons: [
      {
        text: "Digitalbezug einschätzen",
        href: ROUTE_PRECHECK.url,
      },
    ],
    finished: {
      headline: {
        text: "Abgeschlossene Vorprüfung: Der Digitalbezug wurde eingeschätzt.",
      },
      isDisabled: true,
    },
  },
  methods: {
    headline: {
      text: "Erarbeiten eines digitaltauglichen Regelungsvorhabens",
    },
    content:
      "Hier finden Sie passende Methoden und Werkzeuge, um Digitaltauglichkeit in Ihrer Regelung sicherzustellen.",
    finished: {
      headline: {
        text: "Abgeschlossene Erarbeitung eines digitaltauglichen Regelungsvorhabens.",
      },
      isDisabled: true,
    },
  },
  documentation: {
    headline: {
      text: "Dokumentieren der Digitaltauglichkeit",
    },
    content: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen. Der NKR prüft die Digitaltauglichkeit anhand dieser Dokumentation. Die Erkenntnisse der vorigen Schritte helfen Ihnen beim Ausfüllen.`,
    buttons: [
      {
        text: "Zur Dokumentation",
        href: ROUTE_DOCUMENTATION.url,
        look: "ghost",
      },
    ],
    finished: {
      headline: {
        text: "Abgeschlossene Dokumentation der Digitaltauglichkeit.",
      },
      isDisabled: true,
    },
  },
  nkr: stepNKR,
  nkrFinal: {
    ...stepNKR,
    content:
      stepNKR.content +
      `<br class="block content-[''] mb-24" />
Senden Sie die von Ihnen erstellte Dokumentation per E-Mail an folgende Adresse: 
[nkr@bmj.bund.de](mailto:nkr@bmj.bund.de)
<br class="block content-[''] mb-24" />
Damit ist der Digitalcheck für Sie beendet.`,
  },
};

export const landing = {
  title: "Digitaltaugliche Regelungen erarbeiten",
  subtitle: `Hier erfahren Sie,
  - was Digitaltauglichkeit für Ihr Regelungsvorhaben bedeutet,
  - wie Sie eine reibungslose Umsetzung des Vorhabens ermöglichen,
  - welche Unterlagen Sie benötigen.`,
  list: {
    title: "So gehen Sie vor",
    items: [
      steps.preCheck,
      {
        spacer: {
          text: "Bei positiver Vorprüfung:",
        },
        ...steps.methods,
        buttons: [
          {
            text: "Zu den Hilfestellungen",
            href: ROUTE_METHODS.url,
            look: "ghost" as const,
          },
        ],
      },
      steps.documentation,
      steps.nkr,
    ],
  },
  dataNotice: {
    headline: "Ihre Arbeitsstände werden eine Woche lang gespeichert.",
    content:
      "Um in dieser Zeit zu Ihrem alten Arbeitsstand zurückzukehren, nutzen Sie bitte denselben Rechner und Browser.",
  },
  summary: {
    title: "Zusammengefasst",
    items: [
      {
        headline: {
          text: "Was ist Digitaltauglichkeit?",
        },
        content: `Regelungen werden vermehrt digital umgesetzt. Beispiele sind eine Gesetzesänderung, mit der ein Papierantrag durch einen Online-Antrag ersetzt wird oder eine Verordnung, die Änderungen in den IT-Verfahren nachgelagerter Behörden erfordert.
<br class="block content-[''] mb-24" />
Damit die digitale Umsetzung reibungslos klappt, muss die Regelung digitaltauglich gestaltet sein. Das heißt erstens, dass der digitalen Umsetzung nichts im Wege steht, wie zum Beispiel das persönliche Einreichen von Dokumenten. Zweitens soll aktiv gefördert werden, dass möglichst viele Schritte von Computern durchgeführt oder unterstützt werden.`,
      },
      {
        spacer: true,
        headline: {
          text: "Digitaltaugliche Regelungen sparen Ressourcen",
        },
        content: `Eine gute digitale Umsetzung spart langfristig Zeit und sorgt dafür, dass Ziel und Wirkung des Vorhabens erreicht werden: auf Seiten der Normadressaten und -adressatinnen und auf Seiten der Verwaltung.`,
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

[Details und Beispiele](${ROUTE_METHODS_FIVE_PRINCIPLES.url})`,
  },
};

export const supportBanner = {
  feedback: {
    title: "Haben Sie Fragen oder Anmerkungen?",
    text: "Dieser Dienst ist im Aufbau. Wenn Ihnen etwas fehlt oder etwas nicht funktioniert, kontaktieren Sie uns über [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Anmerkungen:%20digitalcheck.bund.de). Ihr Feedback trägt dazu bei, Informationen und Gestaltung der Webseite für alle Nutzenden zu verbessern.",
  },
  support: {
    title: "Sie haben Gesprächsbedarf zu Ihrem Vorhaben?",
    text: `Bei inhaltlichen Anliegen zu Ihrem Regelungsvorhaben helfen wir Ihnen gerne weiter. Schreiben Sie uns über [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Gesprächsbedarf:%20digitalcheck.bund.de) oder rufen Sie uns an unter [0151/40 76 78 39](tel:+4915140767839).`,
  },
};

export const feedbackForm = {
  heading: "Ihr Feedback hilft uns weiter!",
  labels: ["Sehr schwierig", "Schwierig", "Moderat", "Einfach", "Sehr einfach"],
  questionSimple:
    "Wie einfach war es für Sie, unseren Dienst “Digitaltaugliche Regelungen erarbeiten” zu nutzen?",
  questionUseful:
    "Wie hilfreich fanden Sie die angebotenen Hilfestellungen und Methoden für das Erarbeiten ihres Regelungsvorhaben?",
  questionReuse:
    "Würden Sie unsere Hilfestellungen und Methoden für die Erarbeitung Ihres Regelungsvorhaben wieder nutzen?",
  mail: "Schreiben Sie uns eine Email, wenn wir Sie für Feedback zu unserem Service kontaktieren dürfen.",
};

export const interviewBanner = {
  title: "Wir suchen Gesprächspartner!",
  text: `Um diese Seite weiterzuentwickeln, suchen wir nach Personen, die uns in einem 45-minütigen Gespräch Feedback geben. Schreiben Sie uns gerne eine E-Mail und wir melden uns bei Ihnen: [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Gesprächspartner:%20digitalcheck.bund.de).`,
};

const hintInvolved = {
  title: "Wer sind Beteiligte?",
  text: `Beteiligte sind in diesem Zusammenhang all diejenigen, die an der Umsetzung des Regelungsvorhabens beteiligt sind. Das können sowohl Vollzugsakteurinnen und -akteure als auch Betroffene sein.
    
Beispiele für Beteiligte sind:
- Bürgerinnen und Bürger,
- Einwohnende,
- Kommunen, die Verwaltung und Behörden, deren IT- oder Rechtsabteilungen,
- IT-Dienstleistende,
- Unternehmen und
- weitere Organisationen wie z.B. Vereine.`,
};

export const preCheck = {
  start: {
    title: "1. Vorprüfung: Digitalbezug einschätzen",
    subtitle:
      "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen.",
    buttonText: "Digitalbezug einschätzen",
    info: {
      title: "Eine oder mehrere Vorprüfungen?",
      text: "Füllen Sie eine gemeinsame Vorprüfung für alle inhaltlich zusammenhängenden Regelungen eines Vorhabens aus. So viele wie nötig, so wenige wie möglich.",
    },
    summary: {
      title: "Zusammengefasst",
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
          content: `Wir sprechen von Digitalbezug der Umsetzung, wenn ein Prozess zumindest teilweise von einem IT-System abgebildet werden wird. Beispiele sind:
- eine Reihe von Aufgaben mit einem bestimmten Ziel, zum Beispiel das Ausfüllen eines Formulars in ELSTER, um die Steuererklärung einzureichen,
- die Abfrage von Daten aus einem Register oder
- das Bereitstellen von Informationen auf einer Website.`,
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
      text: "**Praxisbeispiel**: Eine Regelung schreibt vor, dass eine Datenbank potentielle Schadstoffe in Lebensmitteln erfasst. Nun kommen neue Inhaltsstoffe dazu. Oder pro Inhaltsstoff müssen weitere Daten zur langfristigen Schädlichkeit erfasst werden. Dafür muss die Datenbank (das IT-System) angepasst werden.",
      hint: {
        title: "Was ist ein IT-System?",
        text: `IT-Systeme sind technische Lösungen, die aus Hardware (wie Computer, Kartenlesegeräte, Router) und Software (Programme wie ELSTER und Word, Websiten, Apps) bestehen, um Informationen zu speichern, zu verarbeiten und zu übertragen. 
      <br />
      Mit ihnen können Aufgaben ausgeführt werden, wie das Übermitteln der Einkommenssteuererklärung mit ELSTER.`,
      },
    },
    {
      id: "verpflichtungen-fuer-beteiligte",
      title: "Verpflichtungen für Beteiligte",
      question:
        "Beinhaltet das Regelungsvorhaben Verpflichtungen für Beteiligte?",
      positiveResult: "beinhaltet Verpflichtungen für Beteiligte.",
      negativeResult: "beinhaltet keine Verpflichtungen für Beteiligte.",
      text: "**Praxisbeispiel**: Für eine staatliche Förderung ist neben der Land- und Forstwirtschaft nun auch das produzierende Gewerbe berechtigt. Der Anspruch dieser Unternehmen kann nicht nach denselben Kriterien geprüft werden. Die Vorhalte-/Nachweispflichten müssen auf diese Gruppe angepasst werden, dabei müssen die für die Beteiligten üblichen digitalen Möglichkeiten mitgedacht, bzw. geschaffen werden.",
      hint: hintInvolved,
    },
    {
      id: "datenaustausch",
      title: "Datenaustausch",
      question:
        "Hat das Regelungsvorhaben einen Datenaustausch zur Folge? Oder kann eine Wiederverwendung von Daten die Umsetzung erleichtern?",
      positiveResult:
        "hat einen Datenaustausch zur Folge. Oder eine Wiederverwendung von Daten kann die Umsetzung erleichtern.",
      negativeResult:
        "hat keinen Datenaustausch zur Folge. Eine Wiederverwendung von Daten kann die Umsetzung nicht erleichtern.",
      text: "**Praxisbeispiel**: Arbeitnehmende müssen ihr Gehalt in der Einkommenssteuererklärung angeben. Diese Information liegt der Sozialversicherung bereits vor. Eine Wiederverwendung dieser Daten ist bürokratiearm und sollte bei der Erarbeitung der Regelung angestrebt werden.",
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
      text: "**Praxisbeispiel**: Ein Antrag für Steuerentlastung muss gestellt und abgeschickt werden — dies kann digital, ohne händische Unterschrift oder analoge Nachweise geschehen.",
      hint: hintInvolved,
    },
    {
      id: "automatisierung",
      title: "Automatisierung",
      question:
        "Kann durch (Teil&#8209;)Automatisierung der Aufwand für Betroffene reduziert werden? Kann digitale Dokumentation die Umsetzung verbessern?",
      positiveResult:
        "kann den Aufwand für Betroffene durch (Teil&#8209;)Automatisierung reduzieren.",
      negativeResult:
        "kann den Aufwand für Betroffene nicht durch (Teil&#8209;)Automatisierung reduzieren.",
      text: "**Praxisbeispiel**: Durch die automatisierte Auszahlung der Energiepreispauschale entfällt sowohl das Errechnen eines Leistungsanspruchs als auch die manuelle Antragstellung durch Leistungsberechtigte.",
      hint: {
        title: "Wer sind Betroffene?",
        text: `Betroffene sind in diesem Zusammenhang all diejenigen, die von der Umsetzung des Regelungsvorhabens betroffen sind.
      <br />
      Beispiele für Betroffene sind:
- Bürgerinnen und Bürger, 
- Einwohnende,
- Unternehmen und 
- weitere Organisationen wie z.B. Vereine.`,
      },
    },
  ].map((question, index, questions) => ({
    // generate list from the questions such that each list has a path, a previous link and a next link
    ...question,
    url: `${ROUTE_PRECHECK.url}/${question.id}`,
    prevLink:
      index === 0
        ? ROUTE_PRECHECK.url
        : `${ROUTE_PRECHECK.url}/${questions[index - 1].id}`,
    nextLink:
      index === questions.length - 1
        ? ROUTE_RESULT.url
        : `${ROUTE_PRECHECK.url}/${questions[index + 1].id}`,
  })) as TQuestion[],

  result: {
    title: "Ergebnis der Vorprüfung",
    positive: {
      title: "Ihr Regelungsvorhaben hat Digitalbezug.",
      reasoningIntro: "Das Regelungsvorhaben ...",
      actionButton: {
        text: "Vorprüfung herunterladen",
        href: ROUTE_ASSESSMENT.url,
      },
      nextSteps: {
        title: "So machen Sie weiter",
        steps: [
          steps.preCheck.finished,
          {
            ...steps.methods,
            buttons: [
              {
                text: "Zu den Hilfestellungen",
                href: ROUTE_METHODS.url,
              },
            ],
          },
          steps.documentation,
          steps.nkr,
        ],
      },
    },
    unsure: {
      title: "Sie haben mehrere Aussagen mit “Ich bin unsicher” beantwortet.",
      hint: "Bitte kontaktieren Sie den Digitalcheck-Support unter: [0151/40 76 78 39](tel:+4915140767839). Wir helfen Ihnen, die Vorprüfung auszufüllen.",
      unsureIntro:
        '**Folgende Fragen haben Sie mit "Ich bin unsicher" beantwortet:**',
      negativeIntro: '**Folgende Fragen haben Sie mit "Nein" beantwortet:**',
      actionButton: {
        text: "Vorprüfung wiederholen",
        href: ROUTE_PRECHECK.url,
      },
      nextStep: {
        title:
          "Sie können auch ohne positive Vorprüfung die Digitaltauglichkeit Ihres Regelungsvorhabens sicherstellen.",
        text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
        link: {
          text: "Zu den Hilfestellungen",
          href: ROUTE_METHODS.url,
        },
      },
    },
    negative: {
      title: "Ihr Regelungsvorhaben hat keinen Digitalbezug.",
      reasoningIntro: "Das Regelungsvorhaben ...",
      nextSteps: {
        title: "So machen Sie weiter",
        steps: [steps.preCheck.finished, steps.nkrFinal],
      },
    },
  },
};

export const assessment = {
  title: "Erhalten Sie die ausgefüllte Vorprüfung als PDF",
  subtitle:
    "Fügen Sie den Arbeitstitel Ihres Regelungsvorhabens hinzu und laden Sie die ausgefüllte Vorprüfung als PDF herunter. Diese können Sie für Ihre eigenen Unterlagen nutzen.",
  form: {
    formLegend: "Bitte erläutern Sie Ihre Einschätzung.",
    policyTitleLabel: "Arbeitstitel des Vorhabens",
    policyTitleRequired: "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    policyTitleTooLong: "Bitte wählen Sie einen kürzeren Titel.",
    reasonLabel: "Begründung",
    reasonRequired:
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    reasonLong:
      "Achtung, Ihre Begründung ist sehr lang. Möglicherweise sehen Sie in dem PDF nicht den gesamten Text. Sie können ihn aber vollständig kopieren, es gehen keine Inhalte verloren.",
    reasonTooLong: "Bitte geben Sie eine kürzere Begründung ein.",
    downloadPdfButton: {
      text: "Vorprüfung herunterladen",
    },
    receiveEmailButton: {
      text: "Per E-Mail erhalten",
    },
    downloadStarted: "Vorprüfung wird heruntergeladen",
  },
  nextSteps: {
    title: "So machen Sie weiter",
    steps: [
      steps.preCheck.finished,
      {
        ...steps.methods,
        buttons: [
          {
            text: "Zu den Hilfestellungen",
            href: ROUTE_METHODS.url,
          },
        ],
      },
      steps.documentation,
      steps.nkr,
    ],
  },
};

export const methods = {
  title: "2. Erarbeiten eines digitaltauglichen Regelungsvorhabens",
  subtitle: `Hier finden Sie passende Methoden und Werkzeuge, um Digitaltauglichkeit in Ihrer Regelung sicherzustellen. 
<br class="block content-[''] mb-24" />
Gehen Sie am besten in der vorgeschlagenen Reihenfolge vor.`,
  steps: {
    items: [
      {
        spacer: { text: "Der sichere Einstieg in jede Regelung" },
        headline: { text: "Erfassen Sie den Ist-Zustand" },
        content: `Ein solides Verständnis über den Ist-Zustand ist ein sinnvoller und sicherer Einstieg. Tauschen Sie sich mit den umsetzenden Akteurinnen und Akteuren aus. Bei dieser Gelegenheit können Sie auch nach Problemen in der aktuellen Praxis fragen.
Wenn Sie in den Gesprächen nichts Neues mehr erfahren, haben Sie den Status Quo erfasst.

**Ein Austausch über die aktuelle Praxis darf auch während des Entwurfsprozesses stattfinden.**

Mit diesen Informationen sind Sie gut vorbereitet, um  
- **Anforderungen** für die neue Regelung zu erarbeiten,  
- **Abstimmungsprozesse** zwischen Bund, Ländern, umsetzenden Behörden und Dienstleistern zu navigieren, 
- in der **formellen Beteiligung** eine wirkungsvolle Umsetzung zu besprechen.`,
      },
      {
        background: "blue",
        headline: { text: "Zuständige Akteurinnen und Akteure auflisten" },
        content: `**Zeit:** ca. vier Stunden
<br class="block content-[''] mb-24" />
Wenn Sie ein Regelungsvorhaben erarbeiten, ist es entscheidend, die **Zuständigkeiten der umsetzenden Akteurinnen und Akteure** zu kennen: Sie sind die Expertinnen und Experten für die digitale, praktische Umsetzung in der Praxis und damit wertvolle Gesprächspartnerinnen und -partner.`,
        buttons: [
          {
            text: "Ansprechpersonen finden",
            href: ROUTE_METHODS_RESPONSIBLE_ACTORS.url,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Aufgaben und Abläufe gemeinsam erfassen",
        },
        content: `**Zeit:** ca. sechs Stunden

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren zusammen

**Support:** Komplexe Abläufen können Sie mit dem Digitalcheck-Support erfassen
<br class="block content-[''] mb-24" />
Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die **aktuellen Abläufe** verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie im vorigen Schritt identifiziert haben. In diesem Schritt müssen Sie noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den **Status Quo**.`,
        buttons: [
          {
            text: "Aufgaben und Abläufe klären",
            href: ROUTE_METHODS_TASKS_PROCESSES.url,
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
<br class="block content-[''] mb-24" />
Nutzen Sie das Fachwissen der Akteurinnen und Akteure, um die verwendeten IT-Systeme für die im vorigen Schritt identifizierten Abläufe zu erfassen und zu verstehen.`,
        buttons: [
          {
            text: "IT-Landschaft verstehen",
            href: ROUTE_METHODS_COLLECT_IT_SYSTEMS.url,
          },
        ],
      },
      {
        spacer: { text: "Praxiswissen einsetzen und Auswirkungen verstehen" },
        headline: { text: "Entwickeln Sie eine digitaltaugliche Regelung" },
        content: `Mit einem guten Verständnis des Ist-Zustandes erarbeiten Sie nun Ihre Regelung. Jetzt geht es darum, Möglichkeiten zur Digitalisierung zu finden und Hindernisse aus dem Weg zu räumen — eine gute digitale Umsetzung spart langfristig Zeit und Geld und erfüllt die heutigen Erwartungen der Betroffenen an den Staat.`,
      },
      {
        background: "blue",
        headline: {
          text: "Möglichkeiten und Hindernisse der digitalen Umsetzung identifizieren",
        },
        content: `**Zeit:** Richtet sich nach der Komplexität des Vorhabens
<br class="block content-[''] mb-24" />
Die fünf Prinzipien für digitaltaugliche Gesetzgebung decken unterschiedliche Aspekte der digitalen Umsetzung ab: Nutzen Sie die Erkenntnisse über den Ist-Zustand aus den vorigen Schritten, um mithilfe der Prinzipien die **Möglichkeiten der digitalen Umsetzung auszuschöpfen und Hindernisse zu erkennen**.`,
        buttons: [
          {
            text: "Fünf Prinzipien nutzen",
            href: ROUTE_METHODS_FIVE_PRINCIPLES.url,
          },
        ],
      },
      {
        background: "blue",
        headline: {
          text: "Technische Umsetzbarkeit sicherstellen",
        },
        content: `**Zeit:** Richtet sich nach der Komplexität des Vorhabens

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren 

**Support:** Eine neutrale Drittmeinung erhalten Sie vom Digitalcheck-Support
<br class="block content-[''] mb-24" />
In diesem Schritt können Sie die Auswirkungen Ihres Regelungsvorhabens auf bestehende sowie neue Abläufe und IT-Systeme analysieren. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der umsetzenden Akteurinnen und Akteure zurück.
        `,
        buttons: [
          {
            text: "IT-Auswirkungen prüfen",
            href: ROUTE_METHODS_TECHNICAL_FEASIBILITY.url,
          },
        ],
      },
      {
        spacer: { text: "Eine digitale, verwaltungsarme Regelung Schreiben" },
        headline: { text: "Verfassen Sie den Regelungsentwurf" },
        content: `Nun folgt der gewohnte Schreibprozess sowie die formelle Beteiligung, Abstimmungen im Haus und zwischen den Ressorts. 

Die Erkenntnisse und Ergebnisse aus den vorigen Schritten helfen Ihnen dabei,  
- Ihren **Regelungstext zu strukturieren**, insbesondere in Abschnitten, die die Umsetzung betreffen,
- in der **Gesetzesbegründung** auf Probleme im Ist-Zustand einzugehen,
- den **Umsetzungsprozess einfach besprechbar** zu machen in Abstimmungen anhand von Visualisierungen.`,
      },
      {
        background: "blue",
        headline: { text: "Schreiben Sie die Regelung" },
        content: `Nutzen Sie Ihre gewohnten Programme und Arbeitshilfen, um die Regelung zu schreiben — z. B. eNorm und das Handbuch der Rechtsförmigkeit.`,
      },
    ],
  },
  nextSteps: {
    title: "So machen Sie weiter",
    items: [
      steps.preCheck.finished,
      steps.methods.finished,
      steps.documentation,
      steps.nkr,
    ],
  },
};

export const documentation = {
  title: "3. Dokumentieren der Digitaltauglichkeit",
  subtitle: `Sie dokumentieren in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Und wie Sie diese in Ihr Regelungsvorhaben einfließen lassen.`,
  buttons: [
    {
      text: "Dokumentation herunterladen",
      href: ROUTE_DOCUMENTATION_STATIC_PDF.url,
    } as const,
    {
      text: "Zurück",
      href: ROUTE_LANDING.url,
      look: "tertiary",
    } as const,
  ],
  multipleNotice: {
    headline: "Eine oder mehrere Dokumentationen?",
    content:
      "Füllen Sie eine gemeinsame Dokumentation für alle inhaltlich zusammenhängenden Regelungen eines Vorhabens aus. So viele wie nötig, so wenige wie möglich.",
  },
  summary: {
    title: "Zusammengefasst",
    items: [
      {
        headline: { text: "Beginnen Sie so früh wie möglich" },
        content: `Schicken Sie die begleitende Dokumentation so früh wie möglich an Ihre Ansprechperson im NKR-Sekretariat, **spätestens mit der Einleitung der Ressortabstimmung**. Fügen Sie die Dokumentation des Digitalcheck und Visualisierungen des Umsetzungsprozesses gerne auch der Ressortabstimmung bei, damit Ihre Kolleginnen und Kollegen Ihre Entscheidungen nachvollziehen können.`,
      },
      {
        headline: { text: "Das prüft der Nationale Normenkontrollrat" },
        content: `Der NKR prüft das Regelungsvorhaben auf Möglichkeiten der digitalen Umsetzung auf Basis des von Ihnen durchgeführten Digitalcheck. Das wesentliche Prüfkriterium ist die methodische und inhaltliche Nachvollziehbarkeit. Sein Prüfergebnis veröffentlicht er gegebenenfalls in seinen Stellungnahmen. Wenn Sie eine Visualisierung angefertigt haben und Sie der Veröffentlichung zustimmen, kann diese an die Stellungnahme angehängt werden. Bei Fragen oder Anregungen kommt Ihre Ansprechperson im NKR-Sekretariat auf Sie zu.`,
      },
    ],
  },
  nextSteps: {
    title: "So machen Sie weiter",
    items: [
      steps.preCheck.finished,
      steps.methods.finished,
      steps.documentation.finished,
      steps.nkrFinal,
    ],
  },
};

export const responsibleActors = {
  title: "Zuständige Akteurinnen und Akteure auflisten",
  subtitle: `Wenn Sie ein Regelungsvorhaben erarbeiten, ist es entscheidend, die **Zuständigkeiten der umsetzenden Akteurinnen und Akteure** zu kennen: Sie sind die Expertinnen und Experten für die digitale, praktische Umsetzung in der Praxis und damit wertvolle Gesprächspartnerinnen und -partner.`,
  guidance: `**Zeit:** ca. vier Stunden`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "Wenn Länder und Kommunen für die Umsetzung zuständig ist, legen die Gesetze auf Bundesebene die Grundlage für eine reibungslose Umsetzung. Sicherlich stehen Sie bereits inhaltlich mit den entsprechenden Vertreterinnen und Vertretern im Austausch, z. B. mit den Landesministerien. Für die digitale Umsetzung sollten Sie zusätzlich das Gespräch mit denen suchen, die die aktuellen Arbeitsabläufe, Prozesse und Systeme kennen. Das funktioniert am besten in bilateralen Gesprächen, die die formellen Beteiligungsformate ergänzen.",
  },
  content: {
    label: "Anleitung",
    title: "Finden Sie konstruktive Gesprächspartnerinnen und -&shy;partner",
    text: `Beginnen Sie mit der Kontaktaufnahme oben in der Hierarchie, lassen Sie ggf. über Ihre Referats- und (Unter-)abteilungsleitung den Kontakt herstellen. Fragen Sie nach den Fachexpertinnen und -experten auf Arbeitsebene, hier steckt in der Regel das tiefste Praxiswissen.
<br class="block content-[''] mb-24" />
- **Kommunen:** Bitten Sie Ansprechpersonen auf Landesebene um Kontakte und nutzen Sie  das gesammelte Wissen in den Kommunalen Spitzenverbänden. 
- **Behörden und Träger:** Nutzen Sie die offiziellen Wege der Häuser.
- **Unternehmen, Sozialpartner, weitere Organisationen:** Fragen Sie in Spitzenverbänden nach Ansprechpersonen für Ihren konkreten Anwendungsfall. 
<br class="block content-[''] mb-24" />

Wenn Sie keine persönlichen Kontakte nutzen können, greifen sie auf Organigramme oder interne Datenbanken zu, z. B. das X500-Verzeichnis.`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/ebenen-auswaehlen-und-ansprechpersonen-sammeln.png",
        alt: `Eine Excel-Tabelle mit dem Titel "Beteiligte Ebenen auswählen und Ansprechpersonen sammeln für [ARBEITSTITEL]" enthält Spalten für Name, Zuständigkeit, Akteursgruppe, Kontaktdaten und Bemerkungen. Der erste Eintrag listet als Beispiel "Maria Muster" als Referentin für das Statistische Bundesamt, zugehörig zur Akteursgruppe "Bund" mit ihren Kontaktdaten.`,
      },
      label: "Vorlage",
      title: "Beteiligte Ebenen auswählen und Ansprechpersonen sammeln",
      text: `Die Excelvorlage hilft Ihnen, die beteiligten Ebenen auszuwählen, Zuständigkeiten zu klären und hilfreiche Ansprechpersonen zu sammeln.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/download/Vorlage - Zuständige Akteurinnen und Akteure.xlsx",
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
      {
        text: "Zum nächsten Schritt",
        look: "tertiary",
        href: ROUTE_METHODS_TASKS_PROCESSES.url,
      },
    ],
  },
} as TMethodPage;

export const tasksProcesses = {
  title: "Aufgaben und Abläufe gemeinsam erfassen",
  subtitle: `Damit Ihre Regelung wirkungsvoll in die Praxis kommt, müssen Sie die **aktuellen Abläufe** verstehen. Holen Sie sich dazu Unterstützung von den Akteurinnen und Akteuren, die Sie im vorigen Schritt identifiziert haben. In diesem Schritt müssen Sie noch nicht auf geplante Neuerungen eingehen. Konzentrieren Sie sich auf den **Status Quo**.`,
  guidance: `**Zeit:** ca. sechs Stunden

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren zusammen

**Support:** Komplexe Abläufe können Sie mit dem Digitalcheck-Support erfassen`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "Wenn Länder und Kommunen für die Umsetzung zuständig ist, legen die Gesetze auf Bundesebene die Grundlage für eine reibungslose Umsetzung. Sicherlich stehen Sie bereits inhaltlich mit den entsprechenden Vertreterinnen und Vertretern im Austausch, z. B. mit den Landesministerien. Für die digitale Umsetzung sollten Sie zusätzlich das Gespräch mit denen suchen, die die aktuellen Arbeitsabläufe, Prozesse und Systeme kennen. Das funktioniert am besten in bilateralen Gesprächen, die die formellen Beteiligungsformate ergänzen.",
  },
  content: {
    label: "Anleitung",
    title: "Erfassen Sie die aktuellen Abläufe",
    text: `Listen Sie auf, welche Schritte und Aufgaben aktuell erfüllt werden, damit das Ziel des Vorhabens erreicht wird, und wie diese im Zusammenhang stehen.

Der Überblick lohnt sich auch bei scheinbar einfachen Abläufen: 
- Fehlende Verbindungen oder unerwartete Abhängigkeiten werden sichtbar.
- Sie erfahren, auf welchen bestehenden Abläufen Sie aufbauen können.

Die Frage, die Sie sich und Ihren Ansprechpersonen stellen können, lautet: „Wer will was wann von wem?”`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/einfache-ablaeufe-und-aufgaben-erfassen.png",
        alt: `Ein Flussdiagramm mit dem Titel "Beispielprozess-Ablauf 'Einkommensteuer-Erklärung durchführen'". Auf der linken Seite ist ein gezeichnetes Gebäude und daneben ein Figur, sie sind als "Akteurin oder Akteur" beschriftet. Als Beispiel steht darunter "Finanzämter". Diese senden Daten zur zentralen Speicherung und Auswertung, dargestellt durch einen Pfeil, der mit "Arbeitsprozess" beschriftet ist. Rechts steht noch einmal das Gebäude mit der Person daneben, beschriftet als "Adressatin oder Adressat". Als Beispiel ist "Bundeszentralamt für Steuern" eingetragen.`,
      },
      label: "Vorlage",
      title: "Einfache Abläufe und Aufgaben erfassen",
      text: `1. Sammeln Sie [Akteurinnen und Akteure](${ROUTE_METHODS_RESPONSIBLE_ACTORS.url}), die an der Umsetzung beteiligt sind, und tragen Sie diese auf der linken Seite ein. (“Wer”)
2. Rechts tragen Sie die Adressatinnen und Adressaten ein. (“von wem”)
3. In die Mitte schreiben Sie die verbindenden Aufgaben. (“will wann was”)

Die Vorlage dient der Orientierung und kann angepasst werden. Ein Beispiel: Adressatinnen und Adressaten, die einen Antrag stellen, können auf der linken Seite stehen, die entsprechende Behörde steht dann rechts.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/download/Vorlage - Einfache Abläufe und Aufgaben erfassen.xlsx",
        },
      ],
    },
    {
      image: {
        src: "/assets/images/visualisierungsbeispiele-fuer-komplexe-ablaeufe.png",
        alt: `Ein Flussdiagramm mit der Überschrift "Rulemap § 9b 2023". Es zeigt die verschiedenen Bedingungen, unter denen eine Steuerentlastung gewährt wird, und ihre Abhängigkeiten.`,
      },
      label: "Vorlage",
      title: "Visualisierungsbeispiele für komplexe Abläufe",
      text: `Komplexe Abläufe können schwieriger zu durchdringen sein und erfordern daher eine detaillierte und strukturierte Herangehensweise. Beginnen Sie mit der groben Skizzierung der wichtigsten Abläufe und unterteilen Sie diese anschließend in spezifische Aufgaben.  Auf der [Werkzeugfinder-Seite des BMI](https://visualisieren.digitalcheck.bund.de/) finden Sie Anleitungen für verschiedene Visualisierungsmethoden. 

Sie können sich auch von den [Visualisierungen im Entwurf des Stromsteuergesetzes](https://dserver.bundestag.de/brd/2024/0232-24.pdf#page=134) inspirieren lassen, die im Rahmen des Digitalcheck entstanden sind. Der Gesetzestext wurde als Rulemap visualisiert, der Umsetzungsprozess als Flussdiagramm. `,
    },
  ],
  tip: {
    label: "Tipps",

    title: "Wertschätzende und zielorientierte Kommunikation",
    text: `- **Hürden und Anforderungen wertschätzen:** Sicherlich werden bei den Gesprächen auch Wünsche und Anforderungen an neue Abläufe auftauchen. Wahrscheinlich werden Sie nicht alle umsetzen können. Bedanken Sie sich für den Input, kommunizieren Sie, was nicht eingearbeitet wird und erläutern Sie die Gründe.
    - **Regelungsziel im Fokus:** Interessenkonflikte treten in den Hintergrund, wenn das Regelungsziel im Sinne der Normadressaten im Mittelpunkt steht — dahinter kann sich meistens vereint werden.`,
  },
  support: {
    label: "Unterstützungsangebot",

    title: "Visualisierungen gemeinsam erstellen",
    text: `Der Digitalcheck-Support unterstützt Sie bei der Visualsierung von Abläufen. Wir helfen Ihnen gerne, insbesondere bei komplexen Abläufen. 

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:+4915140767839) oder [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
    buttons: [
      {
        text: "Termin buchen",
        look: "tertiary",
        href: ROUTE_SUPPORT.url,
      },
    ],
  },
  nextStep: {
    label: "So geht es weiter:",
    title: "IT-Systeme erfassen",
    text: `Nutzen Sie das Fachwissen der Akteurinnen und Akteure, um die verwendete IT-Infrastruktur für die identifizierten Abläufe zu erfassen und zu verstehen.`,
    buttons: [
      {
        text: "Zum nächsten Schritt",
        look: "tertiary",
        href: ROUTE_METHODS_COLLECT_IT_SYSTEMS.url,
      },
    ],
  },
} as TMethodPage;

export const collectITSystems = {
  title: "IT-Systeme gemeinsam erfassen",
  subtitle: `Nutzen Sie das Fachwissen der zuständigen Akteurinnen und Akteure, um die verwendete IT-Infrastruktur für die im vorigen Schritt identifizierten Abläufe zu erfassen und zu verstehen.`,
  guidance: `**Zeit:** ca. sechs Stunden

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren

**Support:** Eine neutrale Drittmeinung erhalten Sie vom Digitalcheck-Support`,
  accordion: {
    title:
      "Was ist zu tun, wenn Länder oder Kommunen für die Umsetzung zuständig sind?",
    text: "Wenn Länder und Kommunen für die Umsetzung zuständig ist, legen die Gesetze auf Bundesebene die Grundlage für eine reibungslose Umsetzung. Sicherlich stehen Sie bereits inhaltlich mit den entsprechenden Vertreterinnen und Vertretern im Austausch, z. B. mit den Landesministerien. Für die digitale Umsetzung sollten Sie zusätzlich das Gespräch mit denen suchen, die die **aktuellen Arbeitsabläufe, Prozesse und Systeme kennen. Das funktioniert am besten in bilateralen Gesprächen, die die formellen Beteiligungsformate ergänzen.",
  },
  content: {
    label: "Anleitung",
    title: "So erfassen Sie die IT-Systeme",
    text: `Dokumentieren Sie die verwendeten IT-Systeme mit ihren Funktionalitäten, Schnittstellen und Anforderungen. 
<br class="block content-[''] mb-24" />
Ein Überblick über die IT-Landschaft hilft Ihnen dabei, 
- alle relevanten Aspekte aufzuschlüsseln und potenziell blinde Flecken zu identifizieren,
- auf bestehende Standards und Prozesse aufzusetzen,
- oder Potenzial für Vereinheitlichung zu nutzen.`,
  },
  boxes: [
    {
      image: {
        src: "/assets/images/it-systeme-erfassen.png",
        alt: `Eine Excel-Tabelle mit dem Titel "IT-Systeme erfassen für [ARBEITSTITEL]", die Spalten sind Name des IT-Systems, Funktionalitäten, Nutzende, Schnittstellen und Zuständigkeit. Als Beispiel ist ELSTER eingetragen, das zur Übermittlung der Steuererklärung von Bürgerinnen und Bürgern oder Unternehmen zu den Sachbearbeiterinnen und Sachbearbeitern der Finanzämter dienst. Es gibt unter Anderem eine Schnittstelle zu einem IT-System für Kapitalertragssteuer und Kirchensteuer. Für die Entwicklung ist das Bayerische Landesamt für Steuern zuständig.`,
      },
      label: "Vorlage",

      title: "IT-Systeme erfassen",
      text: `Nutzen Sie die Vorlage, um die IT-Systeme systematisch und detailliert zu dokumentieren. Sie müssen nicht selbst über das Wissen verfügen: Fragen Sie die zuständigen Akteurinnen und Akteure und ziehen Sie ggf. neutrale IT-Expertise hinzu.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/download/Vorlage - IT-Systeme erfassen.xlsx",
        },
      ],
    },
  ],
  support: {
    label: "Unterstützungsangebot",

    title: "IT-Wissen einfach erklärt",
    text: `Der Digitalcheck-Support unterstützt Sie mit IT-Beratung, um Erkenntnisse zu erläutern und für Ihre Regelung zu nutzen, z. B. durch IT-Hintergrundwissen zu Schnittstellen. Jede Frage ist berechtigt — jede verstandene Antwort wird die Regelung digitaltauglicher machen. 

<br class="block content-[''] mb-24" />

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:+4915140767839) oder [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
    buttons: [
      {
        text: "Termin buchen",
        look: "tertiary",
        href: ROUTE_SUPPORT.url,
      },
    ],
  },
  nextStep: {
    label: "So geht es weiter:",

    title:
      "Möglichkeiten und Hindernisse der digitalen Umsetzung identifizieren",
    text: `Mit einem guten Verständnis des Ist-Zustandes erarbeiten Sie nun Ihre Regelung. Die fünf Prinzipien für digitaltaugliche Gesetzgebung decken unterschiedliche Aspekte der digitalen Umsetzung ab: Nutzen Sie die Erkenntnisse über den Ist-Zustand, um mithilfe der Prinzipien die **Möglichkeiten der digitalen Umsetzung auszuschöpfen und Hindernisse zu erkennen.**`,
    buttons: [
      {
        text: "Zum nächsten Schritt",
        look: "tertiary",
        href: ROUTE_METHODS_FIVE_PRINCIPLES.url,
      },
    ],
  },
} as TMethodPage;

export const fivePrinciples = {
  title: "Fünf Prinzipien für digitaltaugliche Gesetzgebung",
  principals: [
    {
      label: "Anleitung",
      title: "So nutzen Sie die fünf Prinzipien für Ihr Regelungsvorhaben",
      content: `### Als konkrete Umsetzungstipps

Nutzen Sie die Tipps als Inspiration, um in Ihrem Regelungsvorhaben die Möglichkeiten des Digitalen auszuschöpfen und Hindernisse zu erkennen.
<br class="block content-[''] mb-48" />
### Als Checkliste für den Gesamtprozess

Besonders erkenntnisreich sind die fünf Prinzipien, wenn Sie diese auf eine Skizze des geplanten Umsetzungsprozesses anwenden. Skizzieren Sie Schritt für Schritt die Umsetzung und markieren Sie die Stellen, an denen eines oder mehrere Prinzipien wichtig sind. Mehr Infos zu Visualisierungen finden Sie auf [visualisieren.digitalcheck.bund.de](https://visualisieren.digitalcheck.bund.de).`,
    },
    {
      label: "Prinzip 1",
      title: "Digitale Kommunikation sicherstellen",
      content: `### Darum ist das wichtig

Bürgerinnen und Bürger, Mitarbeitende in Unternehmen, weiteren Organisationen und der Verwaltung sind meist an digitale Kommunikation gewöhnt. In der Verwaltung und den Behörden erlaubt eine durchgehend digitale Dokumentation, Bearbeitung und ggf. Prüfung eine effizientere Bearbeitung.
<br class="block content-[''] mb-24" />
Digitale Kommunikation sollte immer bedarfsorientiert und inklusiv sein — in bestimmten Fällen kann z. B. ergänzend auch die Schriftform sinnvoll sein, sofern eine digitale Weiterverarbeitung sichergestellt ist.
<br class="block content-[''] mb-48" />
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
<br class="block content-[''] mb-48" />
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
<br class="block content-[''] mb-48" />
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
<br class="block content-[''] mb-48" />
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
<br class="block content-[''] mb-48" />
### Tipps für Ihr Regelungsvorhaben

- Schaffen Sie die rechtlichen Möglichkeiten für automatisierte und/oder antragslose Verfahren. Prüfen Sie z. B. die Möglichkeit von Pauschalen.
- Formulieren Sie klare Entscheidungsstrukturen. Nutzen Sie dafür eindeutige Kriterien und eine kohärente und logische Systematik. Beziehen Sie IT-Expertise mit ein.
- Versuchen Sie, Rechtsbegriffe zu harmonisieren. Verwenden Sie definierte Rechtsbegriffe aus Ihrem Rechtsbereich. Auslegungen verhindern die vollständige Automatisierung von Umsetzungsprozessen.`,
    },
  ],
  nextStepMethods: {
    label: "So geht es weiter:",

    title: "Technische Umsetzbarkeit sicherstellen",
    text: `Analysieren Sie die Auswirkungen Ihres Regelungsvorhabens auf bestehende und neue Abläufe und IT-Systeme. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der umsetzenden Akteurinnen und Akteure zurück.`,
    buttons: [
      {
        look: "tertiary",
        text: "Zum nächsten Schritt",
        href: ROUTE_METHODS_TECHNICAL_FEASIBILITY.url,
      } as const,
    ],
  },
  nextStep: {
    label: "So geht es weiter:",

    title: "Vorprüfung: Digitalbezug einschätzen",
    text: `Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.`,
    buttons: [
      {
        text: "Digitalbezug einschätzen",
        href: ROUTE_LANDING.url,
        look: "tertiary",
      } as const,
    ],
  },
};

export const technicalFeasibility = {
  title: "Technische Umsetzbarkeit sicherstellen",
  subtitle: `Analysieren Sie die Auswirkungen Ihres Regelungsvorhabens auf bestehende und neue Abläufe und IT-Systeme. Damit stellen Sie die technische Machbarkeit sicher. Greifen Sie dafür auf das Fachwissen der zuständigen Akteurinnen und Akteure zurück und holen Sie sich Hilfe von neutralen IT-Expertinnen und -Experten.`,
  guidance: `**Zeit:** Richtet sich nach der Komplexität des Vorhabens

**Kollaborativ:** Arbeiten Sie mit umsetzenden Akteurinnen und Akteuren.

**Support:** Sie können sich vom Digitalcheck-Support unterstützen lassen.`,
  content: {
    label: "Anleitung",
    title: "Verstehen Sie die Auswirkungen auf IT-Systeme",
    text: `Vergleichen Sie gemeinsam mit den [zuständigen Akteurinnen und Akteuren](${ROUTE_METHODS_RESPONSIBLE_ACTORS.url}) das geplante Vorhaben mit den Möglichkeiten der bestehenden IT-Systeme. Überprüfen Sie die Informationen mithilfe neutraler IT-Expertinnen und -Experten. 
<br class="block content-[''] mb-24" />
So erfahren Sie 
- welche IT-Systeme für Ihr Vorhaben verwendet werden können,
- und an welchen Stellen Änderungen nötig sind.
<br class="block content-[''] mb-24" />

**Sie müssen nicht alles allein bewältigen:** Unterstützung bekommen Sie etwa vom Digitalcheck-Support unter [0151/40 76 78 39](tel:+4915140767839) oder [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
    buttons: [
      {
        text: "Termin buchen",
        look: "tertiary",
        href: ROUTE_SUPPORT.url,
      },
    ],
  },
  boxes: [
    {
      image: {
        src: "/assets/images/aspekte-technischer-umsetzbarkeit.png",
        alt: `Ein Dokument mit der Überschrift "Gesprächsleitfaden technische Umsetzbarkeit". Darunter ist ein Kasten zu sehen, in dem steht "Welche Verbindungen oder Daten müssen angepasst werde?". Vom Kasten führt ein Pfeil nach unten an dem steht "Fertig? Weiter zum nächsten Punkt". Rechts vom Kasten stehen erläuternde Fragen und Beispiele.`,
      },
      label: "Vorlage",
      title: "Gesprächsleitfaden: Aspekte technischer Umsetzbarkeit",
      text: `Besprechen Sie die Fragen im Schaubild gemeinsam mit den IT-Expertinnen und Experten in der Umsetzung. Multidisziplinäre Zusammenarbeit ist hier der Schlüssel.

Das PDF ist barrierearm/barrierefrei.`,
      buttons: [
        {
          text: "Vorlage herunterladen",
          href: "/assets/Schaubild Aspekte Technischer Umsetzbarkeit.pdf",
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
- als **neutrale Moderation** in Gesprächen mit zuständigen Akteurinnen und Akteuren, um potenzielle Interessenkonflikte durch Fachlichkeit zu entschärfen,
- **Erkenntnisse visuell** aufzubereiten — das ist die beste Grundlage für interne und externe Beteiligungsprozesse,
- die **Aussagen externer Dienstleister** zu reflektieren: Wirtschaftlichkeit kann eine Motivation für aufwändige Lösungen sein.

Vereinbaren Sie einen Termin unter [0151/40 76 78 39](tel:+4915140767839) oder [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de?subject=Supportanfrage:%20digitalcheck.bund.de)`,
    buttons: [
      {
        text: "Termin buchen",
        look: "tertiary",
        href: ROUTE_SUPPORT.url,
      },
    ],
  },
  nextStep: {
    label: "So geht es weiter:",
    title:
      "Verfassen Sie den Regelungsentwurf und dokumentieren Sie Ihre Entscheidungen",
    text: `Die gesammelten Erkenntnisse und Ergebnisse helfen Ihnen dabei, Aspekte der Digitaltauglichkeit in Ihrem Regelungsentwurf zu berücksichtigen. Diese Entscheidungen dokumentieren Sie in einem Fragebogen.`,
    buttons: [
      {
        text: "Zu den Hilfestellungen",
        look: "tertiary",
        href: ROUTE_METHODS.url,
      },
    ],
  },
} as TMethodPage;

export const support = {
  title: "Unterstützungsangebote",
  subtitle:
    "Hier finden Sie umfangreiche Unterstützung zur Erarbeitung Ihres Regelungsvorhabens.",
  specificSupport: {
    title: "Gezielte Unterstützung per E-Mail oder Video",
    content: `Wir helfen Ihnen bei konkreten Methoden in einem einstündigen Videotelefonat.<br />
Schreiben Sie uns eine E-Mail oder buchen Sie direkt einen Termin.`,
    iframe:
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3PltsK_eFWpzmd2M1M7O-dbe9kbe9ikfDwLcVJWtn5j_9QFNP-MhIAshExAK7_V32gAwYVEntC?gv=true",
    buttons: [
      {
        text: "Termin buchen",
        look: "primary",
        // href: "https://calendar.app.google/ypAF25ciaPCn4aGd7",
      },
      {
        text: "E-Mail senden",
        look: "tertiary",
        href: "mailto:digitalcheck@digitalservice.bund.de?subject=Unterstützungsangebote:%20digitalcheck.bund.de",
      },
    ],
  },
  quickSupport: {
    title: "Für schnelle Hilfe sind wir telefonisch erreichbar",
    content: `Sie können uns für kleine Fragen auch direkt anrufen unter [0151/40 76 78 39](tel:+4915140767839).`,
  },
};

export const imprint = {
  title: "Impressum",
  content: `## Das Internetangebot wird herausgegeben vom

Bundesministerium des Innern und für Heimat (BMI)<br />
Alt-Moabit 140<br />
10557 Berlin<br />
Telefon: [+49 30 18681-0](tel:+4930186810)<br />
Fax: [+49 30 18681-12926](tel:+49301868112926)<br />
E-Mail: [poststelle@bmi.bund.de](mailto:poststelle@bmi.bund.de)<br />
DE-Mail: [poststelle@bmi-bund.de-mail.de](mailto:poststelle@bmi-bund.de-mail.de)
<br class="block content-[''] mb-24" />

### Weitere Kontaktmöglichkeiten

**Redaktionsleitung**<br />
Abteilung DV (Digitale Verwaltung; Steuerung OZG)<br />
Referat DV I 3 — Digitale Verwaltungstransformation; Digitalcheck<br />
Verantwortlich: Dany Homilius (Referatsleiterin DV I 3)<br />
E-Mail: [DVI3@bmi.bund.de](mailto:DVI3@bmi.bund.de) 
<br class="block content-[''] mb-24" />

### Realisierung, Design, Hosting

DigitalService GmbH des Bundes<br />
Frau Christina Lang und Frau Anja Theurer<br />
Prinzessinnenstraße 8-14<br />
10969 Berlin<br />
E-Mail: [hallo@digitalservice.bund.de](mailto:hallo@digitalservice.bund.de)
<br class="block content-[''] mb-24" />

### Datenschutz

Erfahren Sie mehr hierzu in der [Datenschutzerklärung](${ROUTE_PRIVACY.url})
<br class="block content-[''] mb-24" />

### Barrierefreiheit

Erfahren Sie mehr hierzu in der [Barrierefreiheitserklärung](${ROUTE_A11Y.url})`,
};

export const privacy = {
  title: "Datenschutzerklärung",
  content: `## 1. Grundlagen
<br />

### 1.1 Verantwortlicher und Datenschutzbeauftragte/r

Verantwortlich für die Verarbeitung von personenbezogenen Daten im Rahmen der Bereitstellung der Website [erarbeiten.digitalcheck.bund.de](https://erarbeiten.digitalcheck.bund.de) ist das Bundesministerium des Innern und für Heimat (BMI).
Bundesministerium des Innern und für Heimat (BMI)

Alt-Moabit 140<br />
10557 Berlin<br />
Tel.: [030 / 18 681-0](tel:+4930186810)<br />
Fax: [030 / 18 681-12926](tel:+49301868112926)<br />
E-Mail: [poststelle@bmi.bund.de](mailto:poststelle@bmi.bund.de)

Bei Fragen zum Datenschutz und zu dieser Datenschutzerklärung erreichen Sie die bzw. den Datenschutzbeauftragte/n des BMI unter:

Beauftragte/r für den Datenschutz im BMI (BDS)<br />
Alt-Moabit 140<br />
10557 Berlin<br />
Tel.: [030 / 18 681-0](tel:+4930186810)<br />
E-Mail: [bds@bmi.bund.de](mailto:bds@bmi.bund.de)<br />
<br class="block content-[''] mb-24" />

### 1.2 Personenbezogene Daten

Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt — insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten und/oder zu einer Online-Kennung — identifiziert werden kann.
<br class="block content-[''] mb-24" />

### 1.3 Auftragsverarbeiter

DigitalService GmbH des Bundes<br />
Prinzessinnenstraße 8-14<br />
10969 Berlin<br />

DigitalService ist eine Bundes GmbH. Die Bundesrepublik Deutschland — vertreten durch das Bundesministerium des Innern und für Heimat — hält 100 Prozent der Anteile der GmbH. Mit dem Auftragsverarbeiter wurde eine Vereinbarung gemäß Art. 28 DSGVO geschlossen.

**Datenschutzbeauftragter des Auftragsverarbeiters**

Des Weiteren können Sie datenschutzrechtliche Fragen auch an den Datenschutzbeauftragten des DigitalService richten. Diesen erreichen Sie unter folgender Adresse:

E-Mail: [datenschutz@digitalservice.bund.de](mailto:datenschutz@digitalservice.bund.de)
<br class="block content-[''] mb-48" />

## 2. Verarbeitung personenbezogener Daten im Zusammenhang mit der Nutzung der Website und Rechtsgrundlagen
<br />

### 2.1 Besuch dieser Seite

Zur Verbesserung und Analyse des Nutzendenverhaltens setzen wir ein Produkt-Analyse-Tool (plausible.io) ein, das uns anonym erhobene Daten über die Nutzung unserer Website liefert. Dies hilft uns, das Nutzendenverhalten zu verstehen und unsere Inhalte und Dienstleistungen kontinuierlich zu verbessern. Der Diensteanbieter plausible erhebt die IP-Adresse und wandelt diese sofort in ein anonymisiertes Format um. Ab diesem Zeitpunkt werden keine personenbezogenen Daten mehr verarbeitet.
Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von plausible: [https://plausible.io/data-policy](https://plausible.io/data-policy)

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
<br />

Um die Stabilität (Fehlerkorrektur) und Sicherheit des Angebotes zu gewährleisten sowie um das BSI bei der Abwehr von Gefahren für die Kommunikationstechnik des Bundes zu unterstützen, werden die Daten automatisch in sogenannte Logfiles (technische Protokolldateien) geschrieben und dort angelehnt an § 5 BSIG für eine Dauer von 90 Tagen aufbewahrt. Danach werden sie automatisch gelöscht. Der Zugriff ist durch technische und organisatorische Maßnahmen nur einem festgelegten und nachvollziehbaren Kreis von entsprechend angewiesenen Administratorinnen und Administratoren möglich. 

Der Datenverkehr zwischen Ihrem Webbrowser und den Servern des Dienstes erfolgt über eine verschlüsselte HTTPS-Verbindung. HTTPS ist eine gesicherte Variante des Verbindungsprotokolls (HTTP), mit dem Webbrowser und Server Daten (bspw.: Ihre Eingaben) über das Internet austauschen, um zu verhindern, dass unbefugte Dritte von diesen Kenntnis erhalten. 

Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. e) DSGVO i.V.m. § 3 BDSG. Die Datenverarbeitung dient der zielgerichteten und ausgewogenen Öffentlichkeitsarbeit sowie dem Schutz der IT-Infrastruktur des Bundes. Die damit verbundene Verarbeitung Ihrer Daten beim Besuch der Seite geschieht zu diesem Zweck. Für die Erfüllung dieser Verarbeitungszwecke ist die Verarbeitung der genannten personenbezogenen Daten erforderlich. 
<br class="block content-[''] mb-24" />

### 2.2 Kontaktaufnahme

Die Verarbeitung personenbezogener Daten erfolgt in Abhängigkeit des Kontaktweges. Hierbei kann zwischen Kontaktaufnahme per E-Mail, per Kontaktformular oder Telefon unterschieden werden. Nähere Details zur Verarbeitung Ihrer Daten im Falle der Kontaktaufnahme mit dem BMI entnehmen Sie bitte der allgemeinen [Datenschutzerklärung](https://www.bmi.bund.de/DE/service/datenschutz/datenschutz_node.htm) des BMI.

Bei Anfragen an die Kontakt-E-Mail-Adresse [digitalcheck@digitalservice.bund.de](mailto:digitalcheck@digitalservice.bund.de) werden durch den Auftragsverarbeiter ausschließlich solche Daten verarbeitet, die notwendig sind, um mit Ihnen zu kommunizieren. Hierzu gehören insbesondere jene personenbezogenen Informationen (z. B. Name, Vorname, Anschrift, E-Mail-Adresse usw.), die unmittelbar von Ihnen übersandt werden. Die Löschung der personenbezogenen Daten erfolgt sechs Monate nach dem Zugang der letzten E-Mail. Weitere personenbezogene Daten werden auf dieser Webseite nicht erhoben und verarbeitet.

Die Verarbeitung der Daten ist zur Wahrnehmung unserer Aufgaben erforderlich (Art. 6 Abs. 1 UAbs. 1 lit. e) DSGVO in Verbindung mit § 3 BDSG).
<br class="block content-[''] mb-24" />

### 2.3 Technischer Cookie (über die Session) zur Zwischenspeicherung der Antworten in der Vorprüfung

Bei Nutzung des Services wird ein technischer Cookie verwendet welcher in einer Zeichenkette die Antworten (Ja / Nein / Vielleicht) zwischenspeichert. Diese werden dafür verwendet, ein zurückgehen in der Navigation zu unterstützen. Der Cookie ist kurzlebig und wird mit Saisonende oder spätestens nach sieben Tagen gelöscht. Im Cookie werden keine personenbezogenen Daten gespeichert oder verarbeitet.

**Name:** user-answers
<br />
**Wert:** Zeichenkette/Hash<br />
**Löschfrist:** Session, spätestens nach 7 Tagen.<br />
**Funktionen:**
- Cookie um die Antworten der Vorprüfung zwischenzuspeichern und so ein zurückgehen durch die Fragen zu ermöglichen,
- um die Antworten in eine PDF zu schreiben,
- beinhaltet keine personenbezogenen Daten,
- basiert nicht auf IP oder anderen auf tatsächlichen Nutzer zurückverfolgbaren Informationen,
- Gültigkeit endet mit Ablauf der Sitzung, spätestens nach 7 Tagen.
<br class="block content-[''] mb-48" />

## 3. Datenempfänger

Das BMI setzt im Rahmen einer Auftragsverarbeitung die DigitalService GmbH des Bundes als Dienstleister ein. Mit diesem Dienstleister wurde ein Vertrag gemäß Artikel 28 Abs. 3 DSGVO geschlossen; datenschutzrechtlich verantwortlich ist das BMI. 

Darüber hinaus kann es im Einzelfall zur Weitergabe von Daten an Dritte kommen, soweit wir hierzu rechtlich verpflichtet sind oder dies zur Abwehr einer Gefahr für die öffentliche Sicherheit, zur Verfolgung von Straftaten oder zur Abwehr von Angriffen auf unsere IT-Infrastrukturen erforderlich ist. Eine Weitergabe in anderen Fällen erfolgt nicht. Eine Zusammenführung dieser Daten mit anderen Datenquellen zum Beispiel zum Anlegen von Nutzerprofilen erfolgt durch das BMI nicht.
<br class="block content-[''] mb-48" />

## 4. Werden personenbezogene Daten an Dritte weitergegeben?

Personenbezogene Daten werden ausschließlich in Deutschland verarbeitet und nicht an Dritte weitergeleitet. 
<br class="block content-[''] mb-48" />

## 5. Maßnahmen zur Einhaltung der Datensicherheit

Wir ergreifen umfangreiche Maßnahmen, um die Sicherheit Ihrer Daten zu gewährleisten und unbefugten Zugriff zu verhindern. Hier sind einige der Schritte, die wir unternehmen:

**a.** Sicherheit der Übertragung und Speicherung: Die von Ihnen übermittelten Daten werden per HTTPS verschlüsselt an uns übermittelt und auf verschlüsselten Festplatten gespeichert. Dadurch wird sichergestellt, dass Ihre Informationen während der Übertragung und Speicherung geschützt sind.

**b.** Zugriffskontrollen: Wir verwenden strikte Zugriffskontrollen, um sicherzustellen, dass nur autorisierte Personen Zugriff auf die Systeme und Daten haben. Dies umfasst die Verwendung von sicheren Authentifizierungsmethoden und Berechtigungsverwaltungssystemen.

**c.** Überwachung und Auditing: Unsere Systeme werden kontinuierlich überwacht, um verdächtige Aktivitäten zu erkennen und zu verhindern. Wir führen auch regelmäßige interne & externe Audits durch, um sicherzustellen, dass alle Sicherheitsvorkehrungen ordnungsgemäß funktionstüchtig sind.

**d.** Schulung der Mitarbeiter: Unsere Mitarbeiter werden regelmäßig zu Datenschutz- und Sicherheitsrichtlinien geschult, um sicherzustellen, dass sie die erforderlichen Maßnahmen ergreifen, um die Vertraulichkeit der Daten zu wahren.

Im Rahmen der Verwendung des Dienstes Plausible wurden weitere Maßnahmen zur Sicherheit der personenbezogenen Daten getroffen:

- Speichern der Daten auf Servern in Deutschland
- Beschränkte Zugriffsrechte auf die Daten
- Anonymisierung von IP-Adressen
- Wir sammeln nur Datenpunkte, die relevant sind für die weitere Produktentwicklung im Sinne der Nutzerfreundlichkeit und Erweiterung von Funktionen
<br class="block content-[''] mb-48" />

## 6. Ihre Rechte

Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:

- **Recht auf Auskunft, Art. 15 DSGVO**<br />
Mit dem Recht auf Auskunft erhält der Betroffene eine umfassende Einsicht in die ihn angehenden Daten und einige andere wichtige Kriterien wie beispielsweise die Verarbeitungszwecke oder die Dauer der Speicherung. Es gelten die in § 34 BDSG geregelten Ausnahmen von diesem Recht.

- **Recht auf Berichtigung, Art. 16 DSGVO**<br />
Das Recht auf Berichtigung beinhaltet die Möglichkeit für den Betroffenen, unrichtige oder unvollständige ihn angehende personenbezogene Daten korrigieren zu lassen.

- **Recht auf Löschung, Art. 17 DSGVO**<br />
Das Recht auf Löschung beinhaltet die Möglichkeit für den Betroffenen, Daten beim Verantwortlichen löschen zu lassen. Dies ist allerdings nur dann möglich, wenn die ihn angehenden personenbezogenen Daten nicht mehr notwendig sind, rechtswidrig verarbeitet werden oder eine diesbezügliche Einwilligung widerrufen wurde. Es gelten die in § 35 BDSG geregelten Ausnahmen von diesem Recht.

- **Recht auf Einschränkung der Verarbeitung, Art. 18 DSGVO**<br />
Das Recht auf Einschränkung der Verarbeitung beinhaltet die Möglichkeit für den Betroffenen, eine weitere Verarbeitung der ihn angehenden personenbezogenen Daten vorerst zu verhindern. Eine Einschränkung tritt vor allem in der Prüfungsphase anderer Rechtewahrnehmungen durch den Betroffenen ein.

- **Recht auf Datenübertragbarkeit, Art. 20 DSGVO**<br />
Das Recht auf Datenübertragbarkeit beinhaltet die Möglichkeit für den Betroffenen, die ihn angehenden personenbezogenen Daten in einem gängigen, maschinenlesbaren Format vom Verantwortlichen zu erhalten, um sie ggf. an einen anderen Verantwortlichen weiterleiten zu lassen. Gemäß Art. 20 Abs. 3 Satz 2 DSGVO steht dieses Recht aber dann nicht zur Verfügung, wenn die Datenverarbeitung der Wahrnehmung öffentlicher Aufgaben dient.

- **Recht auf Widerruf der Einwilligung, Art.7 Abs.3 DSGVO**<br />
Soweit die Verarbeitung der personenbezogenen Daten auf Grundlage einer Einwilligung erfolgt, kann der Betroffene diese jederzeit für den entsprechenden Zweck widerrufen. Die Rechtmäßigkeit der Verarbeitung aufgrund der getätigten Einwilligung bleibt bis zum Eingang des Widerrufs unberührt.

- **Recht auf Widerspruch gegen die Erhebung, Verarbeitung und bzw. oder Nutzung, Art. 21 DSGVO**<br />
Das Recht auf Widerspruch beinhaltet die Möglichkeit, für Betroffene in einer besonderen Situation der weiteren Verarbeitung ihrer personenbezogenen Daten zu widersprechen, soweit diese durch die Wahrnehmung öffentlicher Aufgaben oder öffentlicher sowie privater Interessen rechtfertigt ist. Es gelten die in § 36 BDSG geregelten Ausnahmen von diesem Recht.

Zur Ausübung der vorgenannten Rechte können Sie sich schriftlich an die unter Ziffer 1.1 genannten Stellen wenden.

Ihnen steht zudem gemäß Art. 77 DSGVO ein Beschwerderecht bei der datenschutzrechtlichen Aufsichtsbehörde, dem [Bundesbeauftragten für den Datenschutz und die Informationsfreiheit](https://www.bfdi.bund.de/DE/Home/home_node.html), Graurheindorfer Str. 153, 53117 Bonn zu.`,
};

export const accessibility = {
  title: "Erklärung zur Barrierefreiheit",
  content: `*Informationen über die Zugänglichkeit dieser Webseiten gemäß § 12 Behindertengleichstellungsgesetz (BGG) sowie über diesbezügliche Kontaktmöglichkeiten.*
<br class="block content-[''] mb-24" />

Das Bundesministerium des Innern, für Bau und Heimat (BMI) ist bemüht, seine Webseite [erarbeiten.digitalcheck.bund.de](https://erarbeiten.digitalcheck.bund.de) so weit wie möglich barrierefrei zu gestalten. Rechtsgrundlage sind das Behindertengleichstellungsgesetz (BGG), die Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und die harmonisierte europäische Norm EN 301 549 in ihrer jeweils gültigen Fassung.

Im Rahmen eines internen Tests wurde jedoch festgestellt, dass der Webauftritt noch keine vollständige Barrierefreiheit gewährleistet. Das BMI arbeitet dementsprechend mit Nachdruck daran, die barrierefreie Gestaltung seiner Webseite weiter zu verbessern.

Diese Erklärung wurde am 11. Juli 2024 erstellt.
<br class="block content-[''] mb-48" />

## Welche Bereiche sind nicht barrierefrei?

Teilbereiche, die nicht barrierefrei sind:

- Externe Links können nicht immer barrierefrei angeboten werden, da sie auf Inhalte oder Ressourcen außerhalb des aktuellen Angebots verweisen, auf die wir keinen direkten Einfluss haben.
- Anderssprachige Abschnitte und Wörter sind nicht immer technisch als solche gekennzeichnet, was zu unverständlicher Aussprache in Vorlese-Software führen kann.
- An einzelnen Stellen wird ein \`<br/>\` benutzt diese werden noch entfernt.
- In einzelnen Links fehlen noch aussagekräftige Linktexte, diese werden ergänzt.
- Eine Sitemap ist noch nicht vorhanden, somit ist die Informationstiefe nicht erkennbar.
<br class="block content-[''] mb-48" />

## Barriere melden! Hinweise zur Barrierefreiheit

Sind Ihnen weitere Mängel beim barrierefreien Zugang zu Inhalten von [erarbeiten.digitalcheck.bund.de](https://erarbeiten.digitalcheck.bund.de) aufgefallen? Dann können Sie sich gern bei uns melden:

**Bundesministerium des Innern und Heimat (BMI)**<br />
Alt Moabit 140<br />
10557 Berlin<br />
Telefon: [03018 681-0](tel:+4930186810)<br />
Telefax: [03018 681 - 12926](tel:+49301868112926)<br />
E-Mail: [DVI3@bmi.bund.de](mailto:DVI3@bmi.bund.de)
<br class="block content-[''] mb-48" />

## Schlichtungsverfahren

Wenn auch nach Ihrem Hinweis an den oben genannten Kontakt keine zufriedenstellende Lösung gefunden wurde, können Sie sich an die Schlichtungsstelle nach § 16 BGG wenden. Die Schlichtungsstelle BGG hat die Aufgabe, bei Konflikten zum Thema Barrierefreiheit zwischen Menschen mit Behinderungen und öffentlichen Stellen des Bundes eine außergerichtliche Streitbeilegung zu unterstützen. Dabei geht es nicht darum, Gewinner oder Verlierer zu finden. Vielmehr ist es das Ziel, mit Hilfe der Schlichtungsstelle gemeinsam und außergerichtlich eine Lösung für ein Problem zu finden. Das Schlichtungsverfahren ist kostenlos. Es muss kein Rechtsbeistand eingeschaltet werden.
Auf der Internetseite der Schlichtungsstelle finden Sie alle Informationen zum Schlichtungsverfahren. Dort können Sie nachlesen, wie ein Schlichtungsverfahren abläuft und wie Sie den Antrag auf Schlichtung stellen. Sie können den Antrag dort auch in Leichter Sprache oder in Deutscher Gebärdensprache stellen.

Sie erreichen die Schlichtungsstelle unter folgender Adresse:

**Schlichtungsstelle nach dem Behindertengleichstellungsgesetz bei dem Beauftragten der Bundesregierung für die Belange von Menschen mit Behinderungen**<br />
Mauerstraße 53<br />
10117 Berlin<br />
Telefon: [030 18 527-2805](tel:+4930185272805)<br />
Fax: [030 18 527-2901](tel:+4930185272901)<br />
E-Mail: [info@schlichtungsstelle-bgg.de](mailto:info@schlichtungsstelle-bgg.de)<br />
Internet: [www.schlichtungsstelle-bgg.de](https://www.schlichtungsstelle-bgg.de)`,
};
