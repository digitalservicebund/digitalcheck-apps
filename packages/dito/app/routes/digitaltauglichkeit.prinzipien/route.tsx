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
import { getPrinzips, Prinzip } from "../../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINZIPLES.title, matches);
};

export async function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );

  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  const prinzipData = await getPrinzips();
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
        <nav>
          {prinzips.length ? (
            <ul>
              {prinzips.map((prinzip) => (
                <li key={prinzip.documentId}>
                  <Link to={`${prinzip.slug}`} state={{ prinzip }}>
                    {prinzip.Name ? <>{prinzip.Name}</> : <i>No Name</i>}{" "}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No prinzips</i>
            </p>
          )}
        </nav>
      </div>
      <Outlet context={prinzips} />
    </>
  );
}
