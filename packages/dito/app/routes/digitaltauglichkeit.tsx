import { Outlet, useLoaderData } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";

import { redirect } from "@remix-run/node";
import { LoaderFunctionArgs } from "react-router-dom";
import { ROUTE_LANDING, ROUTE_PRINCIPLES } from "../resources/staticRoutes.ts";
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

export async function loader({ request }: LoaderFunctionArgs) {
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

  // redirect to first prinzip if no prinzip is specified in the URL
  const prinzipUrl = new URL(request.url);
  if (prinzipUrl.pathname === ROUTE_PRINCIPLES.url) {
    const firstPrinzip = prinzipData.prinzips.find((p) => p.Nummer === 1);
    return redirect(`${ROUTE_PRINCIPLES.url}/${firstPrinzip?.URLBezeichnung}`);
  }
  return prinzipData.prinzips.toSorted((a, b) => a.Nummer - b.Nummer);
}

export default function Digitaltauglichkeit() {
  return (
    <>
      <Outlet context={useLoaderData<typeof loader>()} />
      <SupportBanner />
    </>
  );
}
