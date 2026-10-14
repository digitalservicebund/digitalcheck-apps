import { interoperabel_angrenzendesEuRecht } from "@/config/routes";
import { ZFL_BASE_URL } from "@/resources/constants";
import { dedent } from "@/utils/dedentMultilineStrings";
import { withBase } from "@/utils/path";

const IEA_LINK =
  "[Verordnung für ein interoperables Europa (EU) 2024/903](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R0903)";

export const spoc = {
  headline: "Nationale Kontaktstelle für ein interoperables Europa",
  content: dedent`
    Als nationale Kontaktstelle gemäß **Art. 17 der Verordnung (EU) 2024/903** unterstützen wir
    - Behörden auf Bundes-, Landes- und kommunaler Ebene
    - Interessierte Akteurinnen und Akteure
    - Nationale Kontaktstellen anderer EU-Mitgliedstaaten
  `,
  responsibilities: {
    headline: "Aufgaben der nationalen Kontaktstelle",
    content: dedent`
      Als Nationale Kontaktstelle sind wir die zentrale Anlaufstelle in Deutschland zur Umsetzung der ${IEA_LINK}. Wir unterstützen Mitarbeitende der öffentlichen Verwaltung dabei, die Interoperabilität von digitalen Systemen zu fördern, um eine vernetzte und bürgernahe Verwaltung in ganz Europa zu ermöglichen.
    `,
    items: [
      {
        title: "Unterstützung der Verwaltung",
        content: dedent`
          Wir stellen die Methodik für die Interoperabilitätsbewertung bereit und unterstützen bei der Durchführung. Ein wichtiger Aspekt ist die Integration dieser Anforderungen in den bestehenden Digitalcheck. Dabei unterstützen wir Sie im gesamten Prozess:
          - bei der Klärung von Fragen zur Interoperabilität
          - beim Ausfüllen der Bewertung
          - und insbesondere beim Identifizieren sogenannter "verbindlicher Anforderungen" und deren Auswirkungen auf die vier Ebenen der Interoperabilität.
        `,
      },
      {
        title: "Ansprechpartner",
        content:
          "Wir sind Ansprechpartner für verschiedene Akteure, darunter andere nationale Kontaktstellen, die Bundesländer, den IT-Planungsrat, die FITKO, sowie interessierte Personen und umsetzende Akteure.",
      },
      {
        title:
          "Austausch und Weiterentwicklung auf deutscher und europäischer Ebene",
        content:
          "Wir nehmen aktiv an Diskussionen auf europäischer Ebene teil und informieren mit dem zuständigen Referat im Bundesministerium für Digitalisierung und Staatsmodernisierung das Interoperable Europe Board. Unsere Aufgabe ist es auch, die Nachnutzung von Lösungen zu fördern, Hilfestellung bei der Umsetzung von Interoperabilitätsanforderungen zu leisten und das Thema in der Verwaltung zu repräsentieren, indem wir bewährte Verfahren, sogenannte Best Practices, teilen.",
      },
      {
        title: "Bereitstellung von Informationen und Austauschformaten",
        content: `Wir stellen Wissen bereit und bereiten das Thema verständlich auf. Dazu zählen [Schulungen](${ZFL_BASE_URL}/schulungen) und verschiedene [Unterstützungsangebote](${ZFL_BASE_URL}).`,
      },
      {
        title: "Förderung von Nachnutzung, Kooperation und Zusammenarbeit",
        content: dedent`
          Wir stellen gute Beispiele bereit, unterstützen bei der Nachnutzung und fördern sektorenübergreifende Zusammenarbeit.

          Falls Sie mit Ihrem Land kooperieren wollen, melden Sie sich bei uns.
        `,
      },
    ],
  },
  landscape: {
    headline: "Nationale Umsetzung der EU-Interoperabilitätsverordnung",
    content: dedent`
      Seit Anfang 2025 muss die ${IEA_LINK} in den EU Mitgliedstaaten verpflichtend umgesetzt werden. Damit sind alle öffentlichen Einrichtungen in Europa, also EU-Institutionen, ihre Mitgliedstaaten und auch deren Bundesländer und Kommunen, verpflichtet Interoperabilitätsbewertungen durchzuführen.

      Diese Bewertungen sind erforderlich, bevor neue oder geänderte verbindliche Anforderungen beschlossen werden, um einen nahtlosen Datenaustausch zwischen Behörden sicherzustellen und den grenzüberschreitenden Zugang zu digitalen Verwaltungsleistungen in der EU zu ermöglichen.

      In Deutschland bettet sich diese Anforderung in die föderale Zusammenarbeit wie folgt ein:
    `,
    image: {
      url: withBase("/images/prozess-nationale-kontaktstelle.png"),
      alternativeText:
        "Netzwerkdiagramm, das die Interaktionen verschiedener deutscher und EU-Behörden im Kontext der EU-Interoperabilitätsverordnung zeigt. Es verdeutlicht, wie Akteurinnen und Akteure wie der IT-Planungsrat, die Nationale Kontaktstelle, das BMDS und die EU-Kommission bei der Umsetzung, Koordination und dem Reporting zusammenarbeiten.",
      caption:
        "Das Organigramm zeigt die Interaktionen der Organisationen und Behörden in Deutschland und der EU im Kontext der Verordnung (EU) 2024/903.",
    },
    details: [
      {
        title: "Beteiligte Behörden und Organisationen",
        content: dedent`
          - **Bundesländer & Kommunen:** Ausgangspunkt, mit dem Hinweis auf die dezentrale Umsetzung durch das Bundesangebot.
          - **IT-Planungsrat:** Koordiniert und empfiehlt die Integration von IT-Strategien.
          - **Nationale Kontaktstelle:** Zentraler Ansprechpartner für Informationsaustausch und Koordination.
          - **Bundesministerium für Digitales und Staatsmodernisierung:** Verantwortlich für die Integration in den Digitalcheck.
          - **EU-Kommission:** Beteiligte an der Weiterentwicklung und Reportings.
          - **27 EU-Staaten mit Kontaktstellen:** Nationale Kontaktstellen für Informationsaustausch.
        `,
      },
      {
        title: "Der rechtliche Rahmen: Einordnung in das EU-Ökosystem",
        content: dedent`
          Der Interoperable Europe Act und der Europäische Interoperabilitätsrahmen (EIF) sind Teil des Ökosystems der EU-Rechtsakte für den digitalen Binnenmarkt. Weitere zentrale Verordnungen, Richtlinien und Frameworks sind darin verankert.

          Übersichten zu den EU-Rechtsakten finden Sie [hier](${interoperabel_angrenzendesEuRecht.path}).

          Deutschland integriert die Anforderungen der Verordnung (EU) 2024/903 in den Digitalcheck und folgt damit den Empfehlungen der EU. Somit werden Ressourcen effizient genutzt und Doppelstrukturen verhindert. Die nationale Kontaktstelle ist beim Digitalcheck-Team angesiedelt.
        `,
      },
    ],
  },
};
