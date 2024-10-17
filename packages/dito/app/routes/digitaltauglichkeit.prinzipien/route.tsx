import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import DetailInfo from "@digitalcheck/shared/components/DetailInfo.tsx";
import { json, redirect } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import {
  ROUTE_LANDING,
  ROUTE_PRINZIPLES,
} from "../../resources/staticRoutes.ts";
import unleash from "../../utils/featureFlags.server.ts";
import prependMetaTitle from "../../utils/metaTitle.ts";
import { getPrinzips, PrinzipRecord } from "../../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINZIPLES.title, matches);
};

// Loader to fetch Prinzip data
export async function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );

  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  const prinzipData = await getPrinzips();

  return json({
    prinzips: prinzipData ? prinzipData.data : [],
  });
}

export default function Prinzip() {
  const { prinzips } = useLoaderData<{ prinzips: PrinzipRecord[] }>();

  const navigate = useNavigate();

  const [selectedPrinciple, setSelectedPrinciple] = useState("Alle Prinzipien");

  const handleSelectChange = (selectedValue: string) => {
    const selectedOption = prinzips.find(
      (principle: PrinzipRecord) => principle.Name === selectedValue,
    );

    if (selectedOption) {
      setSelectedPrinciple(selectedOption.Name);
      navigate(selectedOption.slug, { state: { prinzip: selectedOption } });
    } else {
      setSelectedPrinciple("Alle Prinzipien");
    }
  };

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <h1>{selectedPrinciple}</h1>
        </Container>
      </Background>
      <Container>
        <DetailInfo
          isSelectable={true}
          selectOptions={prinzips.map((prinzip: PrinzipRecord) => prinzip.Name)}
          onChange={(e) => handleSelectChange(e.target.value)}
        />
      </Container>
      <Outlet />
      {/*      <div>
        <h1>Prinzipien</h1>
        <nav>
          {prinzips.length ? (
            <ul>
              {prinzips.map((prinzip: PrinzipRecord) => (
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
      </div>*/}
    </>
  );
}
