const url = process.env.STRAPI_URL || "http://localhost:1337/graphql";

export type Paragraph = {
  Norm: string;
  WarumWichtig: [];
  Tags: Tag[];
  Regelungstext: string;
};

export enum EinschaetzungReferat {
  Ja = "Ja",
  Nein = "Nein",
  Teilweise = "Teilweise",
  NichtRelevant = "Nicht relevant",
}

export type Prinziperfuellung = {
  EinschaetzungReferat: EinschaetzungReferat;
  Paragraphen: Paragraph[];
};

export enum TagEnum {
  Tag1 = "Tag1",
  Tag2 = "Tag2",
}

export type Tag = {
  Tag?: TagEnum;
};

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

export type Prinzipienerfuellung = {
  DigitaleKommunikation: Prinziperfuellung;
  Wiederverwendung: Prinziperfuellung;
  Datenschutz: Prinziperfuellung;
  KlareRegelungen: Prinziperfuellung;
  Automatisierung: Prinziperfuellung;
};

export type Regelungsvorhaben = {
  documentId: string;
  Titel: string;
  Gesetz: boolean;
  Ressort: Ressort;
  NKRStellungnahme?: [];
  DIPVorgang: number;
  NKRNummer: number;
  Prinzipienerfuellung: Prinzipienerfuellung;
  URLBezeichnung: string;
  Rechtsgebiet?: Rechtsgebiet;
};

export type Prinzip = {
  documentId: string;
  Name: string;
  Beschreibung: [];
  Nummer: 1 | 2 | 3 | 4 | 5;
  Tipps?: [];
  GuteUmsetzung: Regelungsvorhaben[];
  URLBezeichnung: string;
};

export type RegelungsvorhabenResponse = {
  data: {
    regelungsvorhabens: Regelungsvorhaben[];
  };
};

export const prinzipErfuellung = `fragment prinzipErfuellung on ComponentSharedPrinziperfuellung {
  EinschaetzungReferat
  NKRStellungnahme
  Paragraphen {
    WarumWichtig
    Norm
    Tags {
      Tag
    }
    Regelungstext
    id
  }
  id
}`;

export const prinzipienErfuellung = `fragment prinzipienErfuellung on ComponentSharedPrinzipienerfuellung {
  Automatisierung { ...prinzipErfuellung }
  Datenschutz { ...prinzipErfuellung }
  DigitaleKommunikation { ...prinzipErfuellung }
  KlareRegelungen { ...prinzipErfuellung }
  Wiederverwendung { ...prinzipErfuellung }
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
      console.error("Failed to fetch:", response.statusText);
      return null;
    }
    return (await response.json()) as ResponseType;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}
