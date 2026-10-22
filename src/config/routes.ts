// ⚠️ This file is auto-generated — do not edit manually. ⚠️

export type Route = {
  readonly key: string;
  readonly path: string;
  readonly title: string;
  readonly parent: Route | null;
  readonly sitemap: boolean;
  readonly isStagingOnly: boolean;
  readonly navOrder: number | null;
  readonly navLabel: string | null;
};

export const assistent = {
  key: "assistent",
  path: "/assistent",
  title: "Assistent",
  parent: null,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: "Übersicht",
} as const;

export const assistent_vorpruefung = {
  key: "assistent_vorpruefung",
  path: "/assistent/vorpruefung",
  title: "Vorprüfung",
  parent: assistent,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const assistent_vorpruefung_automatisierung = {
  key: "assistent_vorpruefung_automatisierung",
  path: "/assistent/vorpruefung/automatisierung",
  title: "Automatisierung",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 5,
  navLabel: null,
} as const;

export const assistent_vorpruefung_datenaustausch = {
  key: "assistent_vorpruefung_datenaustausch",
  path: "/assistent/vorpruefung/datenaustausch",
  title: "Datenaustausch",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 3,
  navLabel: null,
} as const;

export const assistent_vorpruefung_ergebnis = {
  key: "assistent_vorpruefung_ergebnis",
  path: "/assistent/vorpruefung/ergebnis",
  title: "Ergebnis",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const assistent_vorpruefung_euBezug = {
  key: "assistent_vorpruefung_euBezug",
  path: "/assistent/vorpruefung/eu-bezug",
  title: "EU-Bezug",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 6,
  navLabel: null,
} as const;

export const assistent_vorpruefung_itSystem = {
  key: "assistent_vorpruefung_itSystem",
  path: "/assistent/vorpruefung/it-system",
  title: "IT-System",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 1,
  navLabel: null,
} as const;

export const assistent_vorpruefung_kommunikation = {
  key: "assistent_vorpruefung_kommunikation",
  path: "/assistent/vorpruefung/kommunikation",
  title: "Digitale Kommunikation",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 4,
  navLabel: null,
} as const;

export const assistent_vorpruefung_verpflichtungenFuerBeteiligte = {
  key: "assistent_vorpruefung_verpflichtungenFuerBeteiligte",
  path: "/assistent/vorpruefung/verpflichtungen-fuer-beteiligte",
  title: "Verpflichtungen für Beteiligte",
  parent: assistent_vorpruefung,
  sitemap: false,
  isStagingOnly: false,
  navOrder: 2,
  navLabel: null,
} as const;

export const barrierefreiheit = {
  key: "barrierefreiheit",
  path: "/barrierefreiheit",
  title: "Barrierefreiheit",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const bundeslaender = {
  key: "bundeslaender",
  path: "/bundeslaender",
  title: "Gemeinsamer Digitalcheck für Bund und Länder",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: "Bundesländer",
} as const;

export const dasIstNeu = {
  key: "dasIstNeu",
  path: "/das-ist-neu",
  title: "Das ist neu",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const datenschutz = {
  key: "datenschutz",
  path: "/datenschutz",
  title: "Datenschutzerklärung",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dev = {
  key: "dev",
  path: "/dev",
  title: "Astro Komponenten",
  parent: null,
  sitemap: true,
  isStagingOnly: true,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation = {
  key: "dokumentation",
  path: "/dokumentation",
  title: "Dokumentation",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_absenden = {
  key: "dokumentation_absenden",
  path: "/dokumentation/absenden",
  title: "Absenden",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_beteiligungsformate = {
  key: "dokumentation_beteiligungsformate",
  path: "/dokumentation/beteiligungsformate",
  title: "Beteiligungsformate",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_bewertungOrganisatorisch = {
  key: "dokumentation_bewertungOrganisatorisch",
  path: "/dokumentation/bewertung-organisatorisch",
  title: "Organisatorische Interoperabilität",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_bewertungRechtlich = {
  key: "dokumentation_bewertungRechtlich",
  path: "/dokumentation/bewertung-rechtlich",
  title: "Rechtliche Interoperabilität",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_bewertungSemantisch = {
  key: "dokumentation_bewertungSemantisch",
  path: "/dokumentation/bewertung-semantisch",
  title: "Semantische Interoperabilität",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_bewertungTechnisch = {
  key: "dokumentation_bewertungTechnisch",
  path: "/dokumentation/bewertung-technisch",
  title: "Technische Interoperabilität",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_euInteroperabilitaetsbezug = {
  key: "dokumentation_euInteroperabilitaetsbezug",
  path: "/dokumentation/eu-interoperabilitaetsbezug",
  title: "Interoperabilitäts-Bezug",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_hinweise = {
  key: "dokumentation_hinweise",
  path: "/dokumentation/hinweise",
  title: "Hinweise",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_regelungsvorhabenTitel = {
  key: "dokumentation_regelungsvorhabenTitel",
  path: "/dokumentation/regelungsvorhaben-titel",
  title: "Regelungsvorhaben",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_verbindlicheAnforderungen = {
  key: "dokumentation_verbindlicheAnforderungen",
  path: "/dokumentation/verbindliche-anforderungen",
  title: "Verbindliche Anforderungen",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_veroeffentlichung = {
  key: "dokumentation_veroeffentlichung",
  path: "/dokumentation/veroeffentlichung",
  title: "Veröffentlichung",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const dokumentation_zusammenfassung = {
  key: "dokumentation_zusammenfassung",
  path: "/dokumentation/zusammenfassung",
  title: "Zusammenfassung",
  parent: dokumentation,
  sitemap: false,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const grundlagen = {
  key: "grundlagen",
  path: "/grundlagen",
  title: "Grundlagen",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const home = {
  key: "home",
  path: "/",
  title: "Startseite",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const impressum = {
  key: "impressum",
  path: "/impressum",
  title: "Impressum",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const interoperabel = {
  key: "interoperabel",
  path: "/interoperabel",
  title: "Interoperable Lösungen",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: "EU-Interoperabilität",
} as const;

export const interoperabel_angrenzendesEuRecht = {
  key: "interoperabel_angrenzendesEuRecht",
  path: "/interoperabel/angrenzendes-eu-recht",
  title: "Angrenzendes EU-Recht",
  parent: interoperabel,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const interoperabel_loesungen = {
  key: "interoperabel_loesungen",
  path: "/interoperabel/loesungen",
  title: "Interoperable Lösungen",
  parent: interoperabel,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const interoperabel_loesungen_coreVocabularies = {
  key: "interoperabel_loesungen_coreVocabularies",
  path: "/interoperabel/loesungen/core-vocabularies",
  title: "Semantic Core Vocabularies",
  parent: interoperabel_loesungen,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const interoperabel_loesungen_dcatAp = {
  key: "interoperabel_loesungen_dcatAp",
  path: "/interoperabel/loesungen/dcat-ap",
  title: "Data Catalogue Vocabulary Application Profile (DCAT-AP)",
  parent: interoperabel_loesungen,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const interoperabel_nationaleKontaktstelle = {
  key: "interoperabel_nationaleKontaktstelle",
  path: "/interoperabel/nationale-kontaktstelle",
  title: "Nationale Kontaktstelle",
  parent: interoperabel,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const kontakt = {
  key: "kontakt",
  path: "/kontakt",
  title: "Kontakt",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const methoden = {
  key: "methoden",
  path: "/methoden",
  title: "Regelung erarbeiten",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const normenkontrollrat = {
  key: "normenkontrollrat",
  path: "/normenkontrollrat",
  title: "Die Rolle des Nationalen Normenkontrollrats",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: "NKR",
} as const;

export const prinzipien = {
  key: "prinzipien",
  path: "/prinzipien",
  title: "Fünf Prinzipien",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const sitemap = {
  key: "sitemap",
  path: "/sitemap",
  title: "Sitemap",
  parent: null,
  sitemap: true,
  isStagingOnly: false,
  navOrder: null,
  navLabel: null,
} as const;

export const allRoutes = [
  assistent,
  assistent_vorpruefung,
  assistent_vorpruefung_automatisierung,
  assistent_vorpruefung_datenaustausch,
  assistent_vorpruefung_ergebnis,
  assistent_vorpruefung_euBezug,
  assistent_vorpruefung_itSystem,
  assistent_vorpruefung_kommunikation,
  assistent_vorpruefung_verpflichtungenFuerBeteiligte,
  barrierefreiheit,
  bundeslaender,
  dasIstNeu,
  datenschutz,
  dev,
  dokumentation,
  dokumentation_absenden,
  dokumentation_beteiligungsformate,
  dokumentation_bewertungOrganisatorisch,
  dokumentation_bewertungRechtlich,
  dokumentation_bewertungSemantisch,
  dokumentation_bewertungTechnisch,
  dokumentation_euInteroperabilitaetsbezug,
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_veroeffentlichung,
  dokumentation_zusammenfassung,
  grundlagen,
  home,
  impressum,
  interoperabel,
  interoperabel_angrenzendesEuRecht,
  interoperabel_loesungen,
  interoperabel_loesungen_coreVocabularies,
  interoperabel_loesungen_dcatAp,
  interoperabel_nationaleKontaktstelle,
  kontakt,
  methoden,
  normenkontrollrat,
  prinzipien,
  sitemap,
] as const;
