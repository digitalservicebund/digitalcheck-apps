import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";

import { ROUTE_LANDING } from "../resources/staticRoutes.ts";
import unleash from "../utils/featureFlags.server.ts";
import {
  fetchStrapiData,
  paragraphFields,
  Prinzip,
  prinzipCoreFields,
} from "../utils/strapiData.server.ts";

const GET_PRINZIPS_QUERY = `
${paragraphFields}
${prinzipCoreFields}
query GetPrinzips {
  prinzips {
    ...PrinzipCoreFields
    GuteUmsetzungen {
      documentId
      Paragraphen {
        ...ParagraphFields
      }
      Regelungsvorhaben {
        documentId
        Ressort
        Rechtsgebiet
        Titel
        URLBezeichnung
        LinkRegelungstext
        VeroeffentlichungsDatum
      }
    }
  }
}`;

export async function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );
  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  const prinzipData = await fetchStrapiData<{ prinzips: Prinzip[] }>(
    GET_PRINZIPS_QUERY,
  );

  if ("error" in prinzipData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(prinzipData.error, { status: 400 });
  }

  return json(
    prinzipData.prinzips.toSorted((a, b) => a.Nummer - b.Nummer),
    { headers: { "Cache-Control": "max-age=3600" } },
  );
}

export default function Digitaltauglichkeit() {
  return (
    <>
      <Outlet context={useLoaderData<typeof loader>()} />
      <SupportBanner />
    </>
  );
}
