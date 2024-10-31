const url =
  process.env.STRAPI_URL ||
  "https://secure-dinosaurs-1a634d1a3d.strapiapp.com/graphql";

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
  id: number;
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

export type Visualisierung = {
  Bild: {
    documentId: string;
    url: string;
    alternativeText: string;
  };
  Beschreibung: [];
  VisualisierungsArt: string;
};

export type Digitalcheck = {
  DigitaleKommunikation: Prinziperfuellung;
  Wiederverwendung: Prinziperfuellung;
  Datenschutz: Prinziperfuellung;
  KlareRegelungen: Prinziperfuellung;
  Automatisierung: Prinziperfuellung;
  Visualisierung: Visualisierung[];
  documentId: string;
  NKRStellungnahmeDCText?: string;
  Regelungsvorhaben: Regelungsvorhaben;
  VorpruefungITSystem: boolean;
  VorpruefungVerpflichtungen: boolean;
  VorpruefungDatenaustausch: boolean;
  VorpruefungKommunikation: boolean;
  VorpruefungAutomatisierung: boolean;
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
  NKRStellungnahmeRegelungText: [];
};

export type Prinzip = {
  documentId: string;
  Name: string;
  Beschreibung: [];
  Nummer: 1 | 2 | 3 | 4 | 5;
  GuteUmsetzung: Digitalcheck[];
  URLBezeichnung: string;
};

export type RegelungsvorhabenResponse = {
  data: {
    regelungsvorhabens: Regelungsvorhaben[];
  };
};

export const prinzipErfuellung = `fragment prinzipErfuellung on ComponentSharedPrinziperfuellung {
  EinschaetzungReferat
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

export const digitalcheck = `fragment digitalcheck on Digitalcheck {
  Automatisierung { ...prinzipErfuellung }
  Datenschutz { ...prinzipErfuellung }
  DigitaleKommunikation { ...prinzipErfuellung }
  KlareRegelungen { ...prinzipErfuellung }
  Wiederverwendung { ...prinzipErfuellung }
  Visualisierung {
    Beschreibung
    Bild {
      url
      documentId
      alternativeText
    }
    VisualisierungsArt
  }
  documentId
}`;

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
