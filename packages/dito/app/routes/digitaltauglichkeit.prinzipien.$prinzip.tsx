import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, useLoaderData, useLocation } from "@remix-run/react";

import DetailInfo from "@digitalcheck/shared/components/DetailInfo.tsx";
import { LoaderFunction } from "@remix-run/node";
import { getPrinzipBySlug, PrinzipRecord } from "../utils/strapiData.server.ts";

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.prinzip;
  if (!slug) throw new Response("Prinzip not found", { status: 404 });

  try {
    const response = await getPrinzipBySlug(slug);
    if (!response?.data?.length)
      throw new Response("Prinzip not found", { status: 404 });

    const prinzip = response.data[0];
    return json({ prinzip });
  } catch (error) {
    throw new Response(`Error fetching Prinzip data: ${error}`, {
      status: 500,
    });
  }
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const location = useLocation();

  const loaderData = useLoaderData<{ prinzip: PrinzipRecord }>();
  const prinzip =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (location.state?.prinzip as PrinzipRecord | undefined) ||
    loaderData.prinzip;

  if (!prinzip) {
    return (
      <Background backgroundColor="blue">
        <Container>
          <h1>Prinzip not found</h1>
          <p>Sorry, the requested principle could not be found.</p>
        </Container>
      </Background>
    );
  }

  return (
    <>
      <Container>
        <DetailInfo label={["asa", "abc"]} />

        <h2>All Properties:</h2>
        <ul>
          {Object.entries(prinzip).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
