import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  getRegelungsvorhabensBySlug,
  Prinzip,
} from "../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.regelung as string;
  const regelungData = await getRegelungsvorhabensBySlug(slug);
  return json({
    regelung: regelungData?.data.regelungsvorhabens,
  });
};

export default function Gesetz() {
  const { regelungen } = useLoaderData<{ regelungen: Prinzip[] }>();

  return (
    <>
      <Background backgroundColor="blue">
        <Container>Alle Prinzipien</Container>
      </Background>
      <div>
        <h1>Prinzipien</h1>
        {regelungen.length && (
          <ul>
            {regelungen.map((regelung) => (
              <li key={regelung.documentId}>{regelung.Name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
