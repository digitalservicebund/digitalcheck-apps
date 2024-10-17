const url = process.env.STRAPI_URL || "http://localhost:1337";

type ChildNode = {
  text: string;
  type: string;
  url?: string;
  children?: ChildNode[];
};

type Tipp = {
  type: string;
  format?: string;
  children: ChildNode[];
};

type Description = {
  type: string;
  children: ChildNode[];
};

type Regelungsvorhaben = {
  Titel: string;
  Gesetz: boolean;
  Ressort: string;
  NKRStellungnahme?: string;
  DIPVorgang: number;
  NKRNummer: number;
  Prinzipienerfuellung?: object;
  slug: string;
};

export type PrinzipRecord = {
  id: number;
  documentId: string;
  Name: string;
  Beschreibung: Description[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string | null;
  Nummer: number;
  Tipps?: Tipp[];
  regelungsvorhaben?: Regelungsvorhaben[];
  slug: string;
};

interface PrinzipResponse {
  data: PrinzipRecord[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getPrinzipBySlug(slug: string): Promise<PrinzipResponse> {
  const endpoint = `${url}/api/prinzips?filters[slug][$eqi]=${slug}&populate=regelungsvorhaben`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    //TODO: logging
    console.log(response);
    throw new Error("Failed to fetch Prinzip by slug");
  }

  const data: PrinzipResponse = await response.json();
  return data;
}

export async function getPrinzips(): Promise<PrinzipResponse | null> {
  try {
    const endpoint = `${url}/api/prinzips?populate=regelungsvorhaben`;
    const response = await fetch(endpoint, {
      /*            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },*/
    });

    if (!response.ok) {
      // TODO: logging
      console.error(
        "Failed request:",
        response.statusText,
        "Status code:",
        response.status,
      );
      return null;
    }

    const data: PrinzipResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
