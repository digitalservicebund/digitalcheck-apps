const url = process.env.STRAPI_URL || "http://localhost:1337/graphql";

export type Paragraph = {
  Norm: string;
  ErlaeuterungDS?: string;
  Tags: Tag[];
  Text: string;
};

export enum EinschaetzungReferat {
  Ja = "Ja",
  Nein = "Nein",
  Teilweise = "Teilweise",
  NichtRelevant = "Nicht relevant",
}

export type Prinziperfuellung = {
  EinschaetzungReferat: EinschaetzungReferat;
  NKRStellungnahme?: string;
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
  DigitaleKommunikation?: Prinziperfuellung;
  Wiederverwendung?: Prinziperfuellung;
  Datenschutz?: Prinziperfuellung;
  KlareRegelungen?: Prinziperfuellung;
  Automatisierung?: Prinziperfuellung;
};

export type Regelungsvorhaben = {
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  Titel: string;
  Gesetz: boolean;
  Ressort: Ressort;
  NKRStellungnahme?: string;
  DIPVorgang: number;
  NKRNummer: number;
  Prinzipienerfuellung?: Prinzipienerfuellung;
  slug?: string;
  Rechtsgebiet?: Rechtsgebiet;
};

export type Prinzip = {
  documentId: string;
  Name: string;
  Beschreibung: string;
  Nummer: number;
  Tipps?: [];
  regelungsvorhaben: { data: Regelungsvorhaben[] };
  slug?: string;
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
    ErlaeuterungDS
    Norm
    Tags {
      Tag
    }
    Text
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
    regelungsvorhaben {
      Gesetz
      Prinzipienerfuellung {
        ...prinzipienErfuellung
      }
      Rechtsgebiet
      Ressort
      Titel
      documentId
      slug
    }
    slug
  }
}`;

const GET_REGELUNGSVORHABENS_QUERY = `query GetRegelungsvorhabens {
  ${prinzipErfuellung}
  ${prinzipienErfuellung}
  regelungsvorhabens {
    DIPVorgang
    Gesetz
    NKRNummer
    NKRStellungnahme
    Rechtsgebiet
    Ressort
    Prinzipienerfuellung {
      ...prinzipienErfuellung
    }
    Titel
    documentId
    slug
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
