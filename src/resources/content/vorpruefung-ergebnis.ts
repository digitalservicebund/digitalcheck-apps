import {
  assistent_vorpruefung,
  interoperabel,
  methoden,
} from "@/config/routes";
import { steps } from "@/resources/content/shared/naechste-schritte";
import type { ContentLink, Step } from "@/utils/contentTypes.ts";
import { dedent } from "@/utils/dedentMultilineStrings";
import { contact } from "./shared/contact";

export const preCheckResult = {
  title: "Ergebnis der Vorprüfung",
  reasoningIntro: {
    digital: {
      sure: "In Bezug auf **digitale Aspekte** führt Ihr Regelungsvorhaben zu...",
      unsure:
        "In Bezug auf **digitale Aspekte** ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    },
    interoperability: {
      sure: "In Bezug auf **Interoperabilität** führt Ihr Regelungsvorhaben zu...",
      unsure:
        "In Bezug auf **Interoperabilität** ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    },
  },
  detailsTitle: "Aufschlüsselung Ihres Ergebnisses",
  positive: {
    title: "Das Regelungsvorhaben hat einen **Digitalbezug** und ",
    actionButton: {
      text: "Vorprüfung herunterladen",
    },
    nextSteps: {
      title: "So machen Sie weiter",
      steps: [
        steps.preCheck.finished,
        {
          ...steps.methods,
        },
        steps.documentation,
        steps.nkrFinal,
      ] satisfies Step[],
    },
  },
  unsure: {
    title: "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    hint: `Bitte kontaktieren Sie den Digitalcheck-Support unter: ${contact.mdPhoneLink()} oder schreiben Sie uns eine E-Mail an ${contact.mdMailToLink(contact.email, "Supportanfrage: digitalcheck.bund.de")} mit Ihren Fragen. Wir helfen Ihnen, die Vorprüfung auszufüllen.`,
    actionButton: {
      text: "Vorprüfung wiederholen",
      to: assistent_vorpruefung.path,
    } satisfies ContentLink,
    nextStep: {
      title:
        "Sie können auch ohne positive Vorprüfung die Digitaltauglichkeit Ihres Regelungsvorhabens sicherstellen.",
      text: "Wenn digitale Umsetzung für Ihr Regelungsvorhaben wichtig ist, finden Sie hier passende Methoden und Werkzeuge. Sie erfahren, wie Sie den Prozess darstellen und durchdenken, mit Beteiligten ins Gespräch kommen und die fünf Prinzipien anwenden.",
      link: {
        text: "Zu „Erarbeiten“",
        to: methoden.path,
      } satisfies ContentLink,
    },
  },
  negative: {
    title: "Das Regelungsvorhaben hat **keinen Digitalbezug** und ",
    nextSteps: {
      title: "So machen Sie weiter",
      steps: [steps.preCheck.finished, steps.nkrFinal] satisfies Step[],
    },
  },
  infoBox: {
    title: "Was bedeutet das für mein Vorhaben?",
    contentDigitalBezugAndInteroperability:
      "Das bedeutet, dass Sie weitere Schritte unternehmen müssen, um Digitalbezug und EU-Anforderungen an Interoperabilität in Ihrem Regelungsvorhaben sicherzustellen.",
    contentDigitalBezug:
      "Das bedeutet, dass Sie weitere Schritte unternehmen müssen, um Digitalbezug in Ihrem Regelungsvorhaben sicherzustellen.",
    contentInteroperability:
      "Das bedeutet, dass Sie weitere Schritte unternehmen müssen, um Digitalbezug und EU-Anforderungen an Interoperabilität in Ihrem Regelungsvorhaben sicherzustellen.",
  },
  inlineNotice: {
    title: "Es liegt ein Widerspruch in Ihren Angaben vor.",
    content: dedent`
      Sie haben gewählt, dass Ihr Vorhaben keinen Digitalbezug hat, gleichzeitig aber, dass ein Datenaustausch auf EU-Ebene stattfindet. **Dies ist ein Widerspruch, da ein Datenaustausch auf EU-Ebene einen Digitalbezug (digitale Systeme) voraussetzt.**
      
      **Beachten Sie in diesem Kontext:** Interoperabilität ist die Fähigkeit digitaler Systeme, miteinander zu kommunizieren und Daten auszutauschen. **Das heisst, ohne Digitalbezug ist Interoperabilität nicht möglich.**

      Haben Sie Fragen? Kontaktieren Sie uns unter ${contact.mdPhoneLink()} oder ${contact.mdMailToLink(contact.email)}.
    `,
  },
  interoperability: {
    info: {
      title: "Erfahren Sie mehr über Interoperabilität",
      content: dedent`Was bedeutet Interoperabilität für Regelungen und wie beeinflusst sie deren Erarbeitung? Auf unserer [Übersichtsseite](${interoperabel.path}) finden Sie alle wichtigen Informationen dazu.`,
      button: {
        text: "Mehr zu Interoperabilität",
        to: interoperabel.path,
        look: "link" as const,
      } satisfies ContentLink,
    },
    positive: {
      title: "enthält Anforderungen der **Interoperabilität**.",
    },
    negative: {
      title: "**keine** Anforderungen der **Interoperabilität**.",
    },
    unsure: {
      title: "**keine eindeutigen** Anforderungen der **Interoperabilität**.",
    },
  },
  form: {
    formLegend: "Ergebnis absenden und Prüfstelle frühzeitig einbinden",
    instructions: dedent`
      Wir erstellen für Sie eine E-Mail mit dem Ergebnis der Vorprüfung, die sich in Ihrem E-Mail-Programm öffnet.

      - Schicken Sie das Ergebnis an Ihre Prüfstelle (wenn keine Prüfstelle vorhanden ist, dient das Ergebnis als Dokumentation und zur Selbstprüfung)
      - **Bei Anforderungen an Interoperabilität** erhält das Digitalcheck-Team automatisch eine Kopie und meldet sich bei Ihnen.
    `,
    previewLabel: "Vorschau der E-Mail-Vorlage",
    copyIntroText: dedent`**Alternativ** können Sie das Ergebnis der Vorprüfung einfach als Text kopieren und manuell an die zuständige Prüfstelle schicken oder bei Ihren Dokumenten speichern.`,
    vorhabenTitleLabel: "Vorläufiger Arbeitstitel des Vorhabens",
    vorhabenTitleRequired: "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    vorhabenTitleTooLong:
      "Bitte wählen Sie einen kürzeren Titel (100 Zeichen) und ergänzen Sie diesen gegebenenfalls direkt in der resultierenden E-Mail.",
    precheckAnswersRequired: "Bitte geben Sie die Vorprüfung-Antworten an",
    reasonLabel: "Begründung",
    reasonRequired:
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    reasonLong:
      "Achtung, Ihre Begründung ist sehr lang. Möglicherweise sehen Sie in dem PDF nicht den gesamten Text. Sie können ihn aber vollständig kopieren, es gehen keine Inhalte verloren.",
    reasonTooLong:
      "Bitte geben Sie eine kürzere Begründung ein (500 Zeichen) und ergänzen Sie diese gegebenenfalls direkt in der resultierenden E-Mail.",
    emailClientHint: {
      title: "Ihr Email-Programm wird geöffnet...",
      text: `Dies kann je nach Anwendung einen Moment dauern. Sie können diesen Hinweis jederzeit schließen, sobald sich Ihr E-Mail-Programm geöffnet hat. Sollte sich Ihr E-Mail Programm nicht öffnen, kontaktieren Sie uns unter ${contact.mdPhoneLink()} oder per E-Mail an ${contact.mdMailToLink(contact.email, "Supportanfrage: digitalcheck.bund.de")}.`,
    },
    faqs: {
      title: "Häufige Fragen zum Senden der Vorprüfung",
      details: [
        {
          label: "Was passiert, wenn ich auf „E-Mail erstellen“ klicke?",
          text: "In Ihrem E-Mail-Programm öffnet sich eine neue E-Mail. Diese enthält das Vorprüfungs-Ergebnis in Textform mit Ergebnissen zum Digitalbezug und zur EU-Interoperabilität. Sie haben die Möglichkeit, den Text und Empfänger individuell anzupassen und zusätzliche Dokumente anzufügen. Den Zeitpunkt des Versands wählen Sie selbst.",
        },
        {
          label: "Wie wird das Ergebnis der Vorprüfung dokumentiert?",
          text: dedent`
            Wenn Sie das Ergebnis für Ihre Dokumentation benötigen, schicken Sie das Ergebnis per E-Mail an sich selbst und ggf. an Ihre Kolleg:innen. Es gibt zwei Möglichkeiten, die E-Mail zu verakten:
            
            **Manuell über Outlook:**
            - Klicken Sie in Outlook auf „Drucken“.
            - Wählen Sie „Speichern als PDF“ und speichern Sie die Datei ab.
            - Fügen Sie das PDF anschließend in Ihr E-Akten-System ein.
            
            **Direkte Veraktung:**
            - Nutzen Sie, falls vorhanden, die direkte Veraktungsfunktion in Outlook.
          `,
        },
      ],
    },
    downloadPdfButton: {
      text: "Als PDF-Datei herunterladen",
    },
    copyMailButton: {
      text: "E-Mail-Text kopieren",
      textCopied: "Text Kopiert!",
    },
    sendEmailButton: {
      text: "E-Mail erstellen",
    },
    emailTemplate: {
      toNkr: contact.nkrEmail,
      toDC: contact.interoperabilityEmail,
      subject: "Digitalcheck Vorprüfung",
      bodyBefore: dedent`
        Guten Tag,
        
        hiermit erhalten Sie das Ergebnis Ihrer Vorprüfung:
      `,
      bodyAfter: dedent`
        Mit freundlichen Grüßen
        
        *Diese E-Mail wurde automatisch erstellt.*
      `,
    },
    downloadStarted: "Vorprüfung wird heruntergeladen",
    outro: {
      title: "Darum ist es wichtig",
      text: "Bei Interoperabilitätsbezug unterstützt Sie das Digitalcheck-Team gezielt bei der Umsetzung der EU-Anforderungen.",
    },
  },
  print: {
    titlePrefix: "Ihr Vorhaben: ",
  },
};
