import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import { redirect } from "@remix-run/node";
import {
  json,
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import {
  ROUTE_LANDING,
  ROUTE_PRINZIPLES,
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
  return prependMetaTitle(ROUTE_PRINZIPLES.title, matches);
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
    prinzips: prinzipData?.data.prinzips,
  });
}

export default function Prinzipien() {
  const { prinzips } = useLoaderData<{ prinzips: Prinzip[] }>();

  return (
    <>
      <Background backgroundColor="blue">
        <Container>Alle Prinzipien</Container>
      </Background>
      <div>
        <h1>Prinzipien</h1>
        {prinzips.length ? (
          <ul>
            {prinzips.map((prinzip) => (
              <li key={prinzip.URLBezeichnung}>
                <Link to={`${prinzip.URLBezeichnung}`} state={{ prinzip }}>
                  {prinzip.Name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>Keine Prinzipien gefunden...</i>
          </p>
        )}
      </div>
      <Outlet context={prinzips} />
    </>
  );
}
