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

/** w/o NKRStellungnahme as long as we don't show it */
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

/** w/o NKRStellungnahme as long as we don't show it */
export type Regelungsvorhaben = {
  documentId: string;
  Titel: string;
  Gesetz: boolean;
  Ressort: Ressort;
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
  Nummer: number;
  Tipps?: [];
  GuteUmsetzung: Regelungsvorhaben[];
  URLBezeichnung: string;
};

export type PrinzipResponse = {
  data: {
    prinzips: Prinzip[];
  };
};

export type RegelungsvorhabenResponse = {
  data: {
    regelungsvorhabens: Regelungsvorhaben[];
  };
};

const prinzipErfuellung = `fragment prinzipErfuellung on ComponentSharedPrinziperfuellung {
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

const prinzipienErfuellung = `fragment prinzipienErfuellung on ComponentSharedPrinzipienerfuellung {
  Automatisierung { ...prinzipErfuellung }
  Datenschutz { ...prinzipErfuellung }
  DigitaleKommunikation { ...prinzipErfuellung }
  KlareRegelungen { ...prinzipErfuellung }
  Wiederverwendung { ...prinzipErfuellung }
}`;

const GET_PRINZIPS_QUERY = `
${prinzipErfuellung}
${prinzipienErfuellung}
query GetPrinzips {
  prinzips {
    Beschreibung
    Name
    Nummer
    Tipps
    GuteUmsetzung {
      Gesetz
      Prinzipienerfuellung {
        ...prinzipienErfuellung
      }
      Rechtsgebiet
      Ressort
      Titel
      documentId
      URLBezeichnung
    }
    URLBezeichnung
  }
}`;

const GET_REGELUNGSVORHABENS_QUERY = `query GetRegelungsvorhabens {
  ${prinzipErfuellung}
  ${prinzipienErfuellung}
  regelungsvorhabens {
    DIPVorgang
    Gesetz
    NKRNummer
    Rechtsgebiet
    Ressort
    Prinzipienerfuellung {
      ...prinzipienErfuellung
    }
    Titel
    documentId
    URLBezeichnung
  }
}`;

export async function getPrinzips(): Promise<PrinzipResponse | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_PRINZIPS_QUERY,
      }),
    });
    // TODO check if this is correct error handling in GraphQL
    if (!response.ok) {
      console.error("Failed to fetch Prinzips:", response.statusText);
      return null;
    }

    const data: PrinzipResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Prinzips:", error);
    return null;
  }
}

export async function getRegelungsvorhabensBySlug(): Promise<RegelungsvorhabenResponse | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_REGELUNGSVORHABENS_QUERY,
      }),
    });
    // TODO check if this is correct error handling in GraphQL
    if (!response.ok) {
      console.error("Failed to fetch Prinzips:", response.statusText);
      return null;
    }

    const data: RegelungsvorhabenResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Regelungsvorhabens:", error);
    return null;
  }
}
