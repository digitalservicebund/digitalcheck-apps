import {
  assistent_vorpruefung,
  dokumentation,
  methoden,
} from "@/config/routes";
import type { Step } from "@/utils/contentTypes.ts";

const stepPruefstelle: Step = {
  headline: {
    text: "Prüfen durch zuständige Prüfstelle",
  },
  content:
    "Ihre Prüfstelle untersucht Ihr Vorhaben hinsichtlich der Berücksichtigung der Prinzipien digitaltauglicher Gesetzgebung. Senden Sie die von Ihnen erstellte Dokumentation per E-Mail an Ihre Prüfstelle. Die E-Mail-Adresse finden Sie am Ende der Dokumentationserstellung. Damit ist der Digitacheck für Sie beendet. Wenn Sie keine Prüfstelle haben, dient die Dokumentation zur Selbstprüfung.",
  isDisabled: false,
};
export const steps = {
  preCheck: {
    headline: {
      text: "Vorprüfung: Digitalbezug einschätzen",
    },
    content:
      "Finden Sie heraus, ob Sie in Ihrem Regelungsvorhaben Aspekte der digitalen Umsetzung und EU-Anforderungen an Interoperabilität beachten müssen. Danach entscheidet sich, ob die weiteren Schritte für Sie relevant sind.",
    link: {
      text: "Digitalbezug einschätzen",
      to: assistent_vorpruefung.path,
    },
    finished: {
      headline: {
        text: "Abgeschlossene Vorprüfung: Der Digitalbezug wurde eingeschätzt.",
      },
      isDisabled: true,
    },
  },
  methods: {
    headline: {
      text: "Erarbeiten des Regelungsvorhabens",
    },
    content:
      "Nutzen Sie passende Methoden und Werkzeuge, um Digitaltauglichkeit und Interoperabilität in Ihrer Regelung sicherzustellen. Das Digitalcheck-Team steht Ihnen bei der Erarbeitung zur Verfügung.",
    link: {
      text: "Zu „Erarbeiten“",
      to: methoden.path,
    },
    isDisabled: false,
    finished: {
      headline: {
        text: "Abgeschlossene Erarbeitung eines digitaltauglichen Regelungsvorhabens.",
      },
      isDisabled: true,
    },
  },
  documentation: {
    headline: {
      text: "Dokumentieren des Regelungsvorhabens",
    },
    content:
      "Dokumentieren Sie in einem Fragebogen, auf welche Aspekte der Digitaltauglichkeit Sie besonders geachtet haben. Beschreiben Sie, wie Sie diese in das Regelungsvorhaben einfließen lassen. Die Erkenntnisse der vorigen Schritte helfen Ihnen beim Ausfüllen.",
    link: {
      text: "Zu „Dokumentieren“",
      to: dokumentation.path,
    },
    isDisabled: false,
    finished: {
      headline: {
        text: "Abgeschlossene Dokumentation der Digitaltauglichkeit.",
      },
      isDisabled: true,
    },
  },
  nkr: stepPruefstelle,
  nkrFinal: {
    ...stepPruefstelle,
    isDisabled: false,
    content: stepPruefstelle.content,
  },
} satisfies { [key: string]: Step };
