import Container from "@digitalcheck/shared/components/Container.tsx";
import { redirect } from "@remix-run/node";
import {
  json,
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ROUTE_LANDING,
  ROUTE_PRINCIPLES,
} from "../../resources/staticRoutes.ts";
import unleash from "../../utils/featureFlags.server.ts";
import prependMetaTitle from "../../utils/metaTitle.ts";
import {
  digitalcheck,
  fetchStrapiData,
  Prinzip,
  prinzipErfuellung,
} from "../../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINCIPLES.title, matches);
};

const GET_PRINZIPS_QUERY = `
${prinzipErfuellung}
${digitalcheck}
query GetPrinzips {
  prinzips {
    Beschreibung
    Name
    Nummer
    Tipps
    GuteUmsetzung {
      Gesetz
      Digitalcheck {
        ...digitalcheck
      }
      Rechtsgebiet
      Ressort
      Titel
      documentId
      URLBezeichnung
      VeroeffentlichungsDatum
    }
    URLBezeichnung
  }
}`;

export type PrinzipResponse = {
  data: {
    prinzips: Prinzip[];
  };
};

export async function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );

  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  const prinzipData =
    await fetchStrapiData<PrinzipResponse>(GET_PRINZIPS_QUERY);
  return json({
    prinzips: prinzipData?.data.prinzips.sort((a, b) => a.Nummer - b.Nummer),
  });
}

export default function Prinzipien() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prinzips } = useLoaderData<{ prinzips: Prinzip[] }>();

  useEffect(() => {
    if (location.pathname === ROUTE_PRINCIPLES.url && prinzips?.length) {
      const firstPrinzipUrl = `/digitaltauglichkeit/prinzipien/${
        prinzips.find((prinzip) => prinzip.Nummer === 1)?.URLBezeichnung ?? ""
      }`;
      navigate(firstPrinzipUrl, { replace: true });
    }
  }, [location.pathname, prinzips, navigate]);

  return (
    <>
      <Container>
        <div className="flex space-x-20">
          {prinzips?.length &&
            prinzips.map((prinzip) => (
              <p key={prinzip.URLBezeichnung}>
                <Link to={`${prinzip.URLBezeichnung}`} state={{ prinzip }}>
                  Prinzip {prinzip.Nummer}
                </Link>
              </p>
            ))}
        </div>
      </Container>
      <Outlet context={prinzips} />
    </>
  );
}
