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
        title: "Vorprüfung: Digitalbezug einschätzen",
        text: "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
        link: {
          text: "Digitalbezug einschätzen",
          url: PATH_PRECHECK,
        },
      },
      {
        title: "Digitaltaugliches Regelungsvorhaben erarbeiten",
        text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden. [Zu den Hilfestellungen und Methoden](/methoden)",
      },
      {
        title: "Abschließende Dokumentation",
        text: "Nach dem Ihr Regelungsvorhaben abgeschlossen ist, schicken Sie die Dokumentation an das Sekretariat des Normenkontrollrats. [Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)",
      },
      {
        title: "Digitalcheck durch den NKR",
        text: "Sie haben in diesem Schritt keine Aufgaben und können sich anderem widmen. Falls Fragen aufkommen, wird der NKR auf Sie zukommen.",
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

export const preCheck = {
  start: {
    title: "Vorprüfung: Digitalbezug einschätzen",
    subtitle:
      "**TODO** Konsequenzen + Umsetzung mitdenken\n\n Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben auf Aspekte der digitalen Umsetzung achten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
    buttonText: "Digitalbezug einschätzen",
    hint: {
      title: "Digitalbezug",
      text: `**TODO** neuer Text
      
Wir sprechen von digitaler Umsetzung, wenn ein Prozess **zumindest teilweise von einem IT-System abgebildet wird**.
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
      result: "zur Anpassung oder Neuentwicklung einer IT-Systems führen.",
      text: "Praxisbeispiel: Eine Datenbank erfasst potentielle Schadstoffe in Lebensmitteln. Nun kommen neue Inhaltsstoffe dazu. Oder pro Inhaltsstoff müssen weitere Daten zur langfristigen Schädlichkeit erfasst werden. Dafür wird die Datenbank (das IT-System) angepasst. **TODO** weiteres Beispiel",
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
        "Beinhaltet das Regelungsvorhabens Verpflichtungen für Beteiligte?",
      result: "Verpflichtungen für Beteiligte beinhalten.",
      text: "**TODO** Gutes Beispiel, finde die Frage schwammig",
      hint: {
        title: "Beteiligte",
        text: "**TODO** beteiligt vs betroffen \n\n Beteiligte sind in diesem Zusammenhang diejenigen, die an der Umsetzung des Regelungsvorhabens beteiligt sind. Das können Bürgerinnen und Bürger, Einwohnende, die Verwaltung, Unternehmen und weitere Organisationen wie z.B. Vereine sein.",
      },
    },
    {
      id: "datenaustausch",
      title: "Datenaustausch",
      question:
        "Hat das Regelungsvorhabens einen Datenaustausch zur Folge? Kann eine Wiederverwendung von Daten die Umsetzung erleichtern?",
      result:
        "einen Datenaustausch zur Folge haben oder könnten durch Wiederverwendung von Daten vereinfacht werden.",
      text: "Praxisbeispiel: Arbeitnehmende müssen ihr Gehalt in der Einkommenssteuererklärung angeben. Diese Information liegt der Sozialversicherung bereits vor. Andere Daten müssen erst erhoben werden.",
    },
    {
      id: "kommunikation",
      title: "Digitale Kommunikation",
      question:
        "Spielen Interaktion und/oder Kommunikation zwischen Beteiligten in der Umsetzung des Regelungsvorhabens eine Rolle?",
      result:
        "Interaktion und/oder Kommunikation zwischen Beteiligten ein Rolle spielen.",
      text: "**TODO** Praxisbeispiel: ",
      hint: {
        title: "Beteiligte",
        text: "**TODO** beteiligt vs betroffen \n\n Beteiligte sind in diesem Zusammenhang diejenigen, die an der Umsetzung des Regelungsvorhabens beteiligt sind. Das können Bürgerinnen und Bürger, Einwohnende, die Verwaltung, Unternehmen und weitere Organisationen wie z.B. Vereine sein.",
      },
    },
    {
      id: "automatisierung",
      title: "Automatisierung",
      question:
        "Kann durch (Teil-)Automatisierung der Aufwand für Betroffene reduziert werden? Kann digitale Dokumentation die Umsetzung verbessern?",
      result:
        "durch (Teil-)Automatisierung und/oder digitale Dokumentation verbessert.",
      text: "Praxisbeispiel: Durch die Auszahlung einer Pauschale entfällt das Errechnen eines Leistungsanspruchs.",
      hint: {
        title: "Betroffene",
        text: `Betroffene können sein:
- Bürgerinnen und Bürger
- Unternehmen, Vereine, weitere Organisationen
- Kommunen, Verwaltung und Behörden`,
      },
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
    positive: "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    receivePdfButton: {
      text: "Einschätzung als PDF bekommen",
      href: PATH_ASSESSMENT,
    },
    reasonIntro:
      "Die Regelungsvorhaben und seine Umsetzung werden voraussichtlich ...",
    nextSteps: {
      title: "Das sind Ihre nächsten Schritte",
      steps: [
        {
          title: "Digitaltaugliches Regelungsvorhaben erarbeiten",
          text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
          link: {
            text: "Zu den Hilfestellungen und Methoden",
            url: PATH_METHODS,
          },
        },
        {
          title: "Abschließende Dokumentation",
          text: "Nach dem Ihr Regelungsvorhaben abgeschlossen ist, schicken Sie die Dokumentation an das Sekretariat des Normenkontrollrats. [Zur Dokumentation](/assets/digitalcheck-begleitende-dokumentation.pdf)",
        },
        {
          title: "Digitalcheck durch den NKR",
          text: "Sie haben in diesem Schritt keine Aufgaben und können sich anderem widmen. Falls Fragen aufkommen, wird der NKR auf Sie zukommen.",
        },
      ],
    },
  },
};

export const assessment = {
  title: "Erhalten Sie die Einschätzung als PDF",
  subtitle:
    "Lassen Sie uns Ihre E-Mail-Adresse da und Sie bekommen eine **Kopie der Einschätzung des Digitalbezugs** per E-Mail zugestellt. Diese können Sie für ihre eigenen Unterlagen nutzen.",
  form: {
    policyTitleLabel: "Arbeitstitel des Vorhabens",
    downloadPdfButton: {
      text: "Als PDF herunterladen",
    },
    receiveEmailButton: {
      text: "Per E-Mail erhalten",
    },
  },
};
