import { BlocksContent } from "@strapi/blocks-react-renderer";

const url =
  process.env.STRAPI_URL ||
  "https://secure-dinosaurs-1a634d1a3d.strapiapp.com/graphql";

export type EinschaetzungReferat =
  | "Ja"
  | "Nein"
  | "Teilweise"
  | "Nicht relevant";

export enum Ressort {
  Aa = "AA",
  Bmas = "BMAS",
  Bmbf = "BMBF",
  Bmdv = "BMDV",
  Bmel = "BMEL",
  Bmf = "BMF",
  Bmfsfj = "BMFSFJ",
  Bmg = "BMG",
  Bmi = "BMI",
  Bmj = "BMJ",
  Bmuv = "BMUV",
  BmVg = "BMVg",
  Bmwk = "BMWK",
  Bmwsb = "BMWSB",
  Bmz = "BMZ",
}

export enum Rechtsgebiet {
  Tbd = "TBD",
}

export type PrinzipName =
  | "DigitaleKommunikation"
  | "Wiederverwendung"
  | "Datenschutz"
  | "KlareRegelungen"
  | "Automatisierung";

export type Paragraph = {
  documentId: string;
  Nummer: string;
  Gesetz: string;
  Namen?: string;
  Artikel?: string;
  Digitalcheck: Digitalcheck;
  Absaetze: Absatz[];
};

export type PrinzipKurzbezeichnung = {
  Name: PrinzipName;
};

export type Absatz = {
  id: number;
  Text: BlocksContent;
  PrinzipErfuellungen: Prinziperfuellung[];
};

export type Prinziperfuellung = {
  id: number;
  Prinzip: PrinzipKurzbezeichnung;
  WarumGut: BlocksContent;
  KontextStart: number;
  KontextEnde: number;
};

export type Visualisierung = {
  documentId: string;
  Titel: string;
  Visualisierungsart?: string;
  Visualisierungstool?: string;
  Beschreibung: BlocksContent;
  Bild: {
    documentId: string;
    url: string;
    alternativeText: string;
  };
  Digitalcheck: Digitalcheck;
};

export type Digitalcheck = {
  documentId: string;
  NKRStellungnahmeDCText?: string;
  VorpruefungITSystem: boolean;
  VorpruefungVerpflichtungen: boolean;
  VorpruefungDatenaustausch: boolean;
  VorpruefungKommunikation: boolean;
  VorpruefungAutomatisierung: boolean;
  EinschaetzungKommunikation: EinschaetzungReferat;
  EinschaetzungWiederverwendung: EinschaetzungReferat;
  EinschaetzungDatenschutz: EinschaetzungReferat;
  EinschaetzungKlareRegelungen: EinschaetzungReferat;
  EinschaetzungAutomatisierung: EinschaetzungReferat;
  Regelungsvorhaben: Regelungsvorhaben;
  Titel: string;
  Paragraphen: Paragraph[];
  Visualisierungen: Visualisierung[];
};

export type Regelungsvorhaben = {
  documentId: string;
  Titel: string;
  Ressort: Ressort;
  NKRStellungnahmeLink?: string;
  DIPVorgang: number;
  NKRNummer: number;
  Digitalcheck: Digitalcheck[];
  URLBezeichnung: string;
  Rechtsgebiet?: Rechtsgebiet;
  VeroeffentlichungsDatum?: Date;
  NKRStellungnahmeRegelungText: string;
  Digitalchecks: Digitalcheck[];
  LinkRegelungstext: string;
};

export type Prinzip = {
  documentId: string;
  Name: string;
  Beschreibung: BlocksContent;
  Nummer: 1 | 2 | 3 | 4 | 5;
  GuteUmsetzungen: Digitalcheck[];
  URLBezeichnung: string;
  Kurzbezeichnung: PrinzipKurzbezeichnung;
};

export type RegelungsvorhabenResponse = {
  data: {
    regelungsvorhabens: Regelungsvorhaben[];
  };
};

export async function fetchStrapiData<ResponseType>(
  query: string,
  variables?: object,
): Promise<ResponseType | null> {
  try {
    console.log(query);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    // TODO check if this is correct error handling in GraphQL
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        "Failed to fetch:",
        response.status,
        response.statusText,
        errorDetails,
      );
      return null;
    }
    return (await response.json()) as ResponseType;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}
