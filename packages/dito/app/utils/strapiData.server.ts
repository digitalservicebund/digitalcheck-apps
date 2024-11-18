import { BlocksContent } from "@strapi/blocks-react-renderer";

const url =
  process.env.STRAPI_URL ??
  "https://secure-dinosaurs-1a634d1a3d.strapiapp.com/graphql";

export type EinschaetzungReferat =
  | "Ja"
  | "Nein"
  | "Teilweise"
  | "Nicht relevant";

export type Ressort =
  | "AA"
  | "BMAS"
  | "BMBF"
  | "BMDV"
  | "BMEL"
  | "BMF"
  | "BMFSFJ"
  | "BMG"
  | "BMI"
  | "BMJ"
  | "BMUV"
  | "BMVg"
  | "BMWK"
  | "BMWSB"
  | "BMZ";

export type Rechtsgebiet = "TBD";

export type PrinzipErfuellung = {
  id: number;
  Prinzip: Prinzip;
  WarumGut: BlocksContent;
};

export type Absatz = {
  id: number;
  Text: BlocksContent;
  PrinzipErfuellungen: PrinzipErfuellung[];
};

export type Paragraph = {
  documentId: string;
  Nummer: string;
  Gesetz: string;
  Titel?: string;
  Artikel?: string;
  Digitalcheck: Digitalcheck;
  Absaetze: Absatz[];
};

export type Prinzip = {
  documentId: string;
  Name: string;
  Beschreibung: BlocksContent;
  Nummer: 1 | 2 | 3 | 4 | 5;
  GuteUmsetzungen: Digitalcheck[];
  URLBezeichnung: string;
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
  Titel: string;
  NKRStellungnahmeDCText?: BlocksContent;
  EinschaetzungKommunikation: EinschaetzungReferat;
  EinschaetzungWiederverwendung: EinschaetzungReferat;
  EinschaetzungDatenschutz: EinschaetzungReferat;
  EinschaetzungKlareRegelungen: EinschaetzungReferat;
  EinschaetzungAutomatisierung: EinschaetzungReferat;
  Regelungsvorhaben: Regelungsvorhaben;
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
  URLBezeichnung: string;
  Rechtsgebiet?: Rechtsgebiet;
  VeroeffentlichungsDatum?: string;
  Digitalchecks: Digitalcheck[];
  LinkRegelungstext: string;
};

export type RegelungsvorhabenResponse = {
  data: {
    regelungsvorhabens: Regelungsvorhaben[];
    prinzips: Prinzip[];
  };
};

export const prinzipCoreFields = `
 fragment PrinzipCoreFields on Prinzip {
  documentId
  Nummer
  Name
  Beschreibung
  URLBezeichnung
}`;

export const paragraphFields = `
fragment ParagraphFields on Paragraph {
  documentId
  Nummer
  Titel
  Gesetz
  Artikel
  Absaetze {
    id
    Text
    PrinzipErfuellungen {
      id
      WarumGut
      Prinzip {
        ...PrinzipCoreFields
      }
    }
  }
}`;

export async function fetchStrapiData<ResponseType>(
  query: string,
  variables?: object,
): Promise<ResponseType | null> {
  try {
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
