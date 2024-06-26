import type { TQuestion } from "routes/vorpruefung.$questionId";
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
        headline: {
          text: "Digitaltaugliches Regelungsvorhaben erarbeiten",
        },
        content:
          "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden. [Zu den Hilfestellungen und Methoden](/methoden)",
      },
      {
        headline: {
          text: "Abschließende Dokumentation",
        },
        content:
          "Nach dem Ihr Regelungsvorhaben abgeschlossen ist, schicken Sie die Dokumentation an das Sekretariat des Normenkontrollrats. [Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)",
      },
      {
        headline: {
          text: "Digitalcheck durch den NKR",
        },
        content:
          "Sie haben in diesem Schritt keine Aufgaben und können sich anderem widmen. Falls Fragen aufkommen, wird der NKR auf Sie zukommen.",
      },
    ],
  },
  explanation: {
    title: "Warum ist Digitaltauglichkeit wichtig?",
    text: `Fast alle Regelungen werden mindestens zum Teil digital umgesetzt: Zum Beispiel eine Gesetzesänderung, mit der ein Papierantrag durch einen Online-Antrag ersetzt wird. Oder eine Verordnung, die Änderungen in den IT-Verfahren nachgelagerter Behörden erfordert.
<br />
<br />
Damit die digitale Umsetzung reibungslos klappt, muss die Regelung digitaltauglich gestaltet sein. Das heißt einerseits, dass **der digitalen Umsetzung nichts im Wege steht**, wie zum Beispiel das persönliche Einreichen von Dokumenten. Auf der anderen Seite soll aktiv gefördert werden, dass **möglichst viele Schritte von Computern durchgeführt oder unterstützt werden**.
<br />
<br />
Eine gute digitale Umsetzung **spart langfristig Zeit** und sorgt dafür, dass Ziel und Wirkung des Vorhabens erreicht werden: Auf Seiten der Normadressaten und -adressatinnen und auf Seiten der Verwaltung.`,
  },
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
    title: "Vorprüfung: Digitalbezug einschätzen",
    // TODO: Konsequenzen + Umsetzung mitdenken
    subtitle:
      "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
    buttonText: "Digitalbezug einschätzen",
    info: {
      title: "Mehr als eine Regelung?",
      text: "Hat ihr Vorhaben mehrere Regelungen, schätzen Sie den Digitalbezug für alle gemeinsam ein.",
    },
    hint: {
      title: "Digitalbezug",
      // TODO: neuer Text
      text: `Wir sprechen von digitaler Umsetzung, wenn ein Prozess **zumindest teilweise von einem IT-System abgebildet wird**.
Dabei kann es sich um eine Reihe von Aufgaben mit einem bestimmten Ziel handeln, zum Beispiel das Ausfllen eines Formulars in ELSTER, um die Steuererklärung einzureichen.
Es kann sich auch um die Abfrage von Daten aus einem Register handeln. Oder um das Bereitstellen von Informationen auf einer Website.`,
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
      result: "zur Anpassung oder Neuentwicklung eines IT-Systems führt.",
      // text: "Praxisbeispiel: Eine Datenbank erfasst potentielle Schadstoffe in Lebensmitteln. Nun kommen neue Inhaltsstoffe dazu. Oder pro Inhaltsstoff müssen weitere Daten zur langfristigen Schädlichkeit erfasst werden. Dafür wird die Datenbank (das IT-System) angepasst. **TODO** weiteres Beispiel",
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
      result: "Verpflichtungen für Beteiligte zur Folge haben wird.",
      // text: "**TODO** Gutes Beispiel, finde die Frage schwammig",
      hint: hintInvolved,
    },
    {
      id: "datenaustausch",
      title: "Datenaustausch",
      question:
        "Hat das Regelungsvorhaben einen Datenaustausch zur Folge? Kann eine Wiederverwendung von Daten die Umsetzung erleichtern?",
      result:
        "einen Datenaustausch zur Folge hat oder durch Wiederverwendung von Daten vereinfacht würde.",
      // text: "Praxisbeispiel: Arbeitnehmende müssen ihr Gehalt in der Einkommenssteuererklärung angeben. Diese Information liegt der Sozialversicherung bereits vor. Andere Daten müssen erst erhoben werden.",
    },
    {
      id: "kommunikation",
      title: "Digitale Kommunikation",
      question:
        "Spielen Interaktion und/oder Kommunikation zwischen Beteiligten in der Umsetzung des Regelungsvorhabens eine Rolle?",
      result:
        "Interaktion und/oder Kommunikation zwischen Beteiligten beinhaltet.",
      // text: "**TODO** Praxisbeispiel: ",
      hint: hintInvolved,
    },
    {
      id: "automatisierung",
      title: "Automatisierung",
      question:
        "Kann durch (Teil-)Automatisierung der Aufwand für Betroffene reduziert werden? Kann digitale Dokumentation die Umsetzung verbessern?",
      result:
        "durch (Teil-)Automatisierung und/oder digitale Dokumentation verbessert wird.",
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
    unsure: "Es ist nicht klar, ob Ihr Regelungsvorhaben Digitalbezug hat.",
    receivePdfButton: {
      text: "Einschätzung als PDF bekommen",
      href: PATH_ASSESSMENT,
    },
    reasonIntro:
      "Digitalbezug liegt vor, wenn die Umsetzung des Regelungsvorhabens voraussichtlich ...",
    nextStepsPositive: {
      title: "Das sind Ihre nächsten Schritte",
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
    noticeUnsure: {
      title: `Sie haben mehrere Aussagen mit "Unsicher" beantwortet.`,
      text: `Bitte kontaktieren Sie den Digitalcheck-Support unter: <a href="tel:0151/40 76 78 39">0151/40 76 78 39</a>. Wir helfen Ihnen, die Vorprüfung auszufüllen.`,
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
      title: "Das sind Ihre nächsten Schritte",
      step: stepNKR,
    },
  },
};

export const assessment = {
  title: "Erhalten Sie die Einschätzung als PDF",
  subtitle:
    "Lassen Sie uns Ihre E-Mail-Adresse da und Sie bekommen eine **Kopie der Einschätzung des Digitalbezugs** per E-Mail zugestellt. Diese können Sie für ihre eigenen Unterlagen nutzen.",
  form: {
    formLegend: "Bitte erläutern Sie, warum kein Digitalbezug exisitiert.",
    policyTitleLabel: "Arbeitstitel des Vorhabens",
    policyTitleRequired: "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    reasonLabel: "Begründung",
    reasonRequired:
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    downloadPdfButton: {
      text: "Als PDF herunterladen",
    },
    receiveEmailButton: {
      text: "Per E-Mail erhalten",
    },
  },
};
