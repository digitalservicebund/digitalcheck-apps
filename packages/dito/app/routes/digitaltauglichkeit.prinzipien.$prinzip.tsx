import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import { LoaderFunction } from "@remix-run/node";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader: LoaderFunction = ({ params }) => {
  const slug = params.prinzip;
  if (!slug) throw new Response("Prinzip not found", { status: 404 });
  return json({ slug });
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { slug } = useLoaderData<typeof loader>();
  const prinzips: Prinzip[] = useOutletContext();
  const prinzip = prinzips.find((prinzip) => prinzip.slug === slug);
  if (!prinzip) {
    throw new Response("Prinzip not found", { status: 404 });
  }
  return (
    <>
      <Container>
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
