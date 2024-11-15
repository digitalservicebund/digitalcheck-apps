import { redirect } from "@remix-run/node";
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  ROUTE_LANDING,
  ROUTE_PRINCIPLES,
} from "../../resources/staticRoutes.ts";
import unleash from "../../utils/featureFlags.server.ts";
import prependMetaTitle from "../../utils/metaTitle.ts";
import {
  fetchStrapiData,
  paragraphFields,
  Prinzip,
  prinzipCoreFields,
} from "../../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINCIPLES.title, matches);
};

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
        VeroeffentlichungsDatum
      }
    }
  }
}`;

export type PrinzipResponse = {
  data: {
    prinzips: Prinzip[];
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );

  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  const prinzipData =
    await fetchStrapiData<PrinzipResponse>(GET_PRINZIPS_QUERY);

  // redirect to first prinzip if no prinzip is specified in the URL
  const prinzipUrl = new URL(request.url);
  if (prinzipUrl.pathname === ROUTE_PRINCIPLES.url) {
    const firstPrinzip = prinzipData?.data.prinzips.find((p) => p.Nummer === 1);
    return redirect(`${ROUTE_PRINCIPLES.url}/${firstPrinzip?.URLBezeichnung}`);
  }

  return {
    prinzips: prinzipData?.data.prinzips.sort((a, b) => a.Nummer - b.Nummer),
  };
}

export default function Prinzipien() {
  const { prinzips } = useLoaderData<{ prinzips: Prinzip[] }>();

  return <Outlet context={prinzips} />;
}
