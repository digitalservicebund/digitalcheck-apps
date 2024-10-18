import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import DetailInfo from "@digitalcheck/shared/components/DetailInfo.tsx";
import { LoaderFunction } from "@remix-run/node";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.prinzip;
  if (!slug) throw new Response("Prinzip not found", { status: 404 });
  return json({ slug });
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { slug } = useLoaderData<typeof loader>();
  const prinzips: Prinzip[] = useOutletContext();
  const prinzip = prinzips.find((prinzip) => prinzip.slug === slug);
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
