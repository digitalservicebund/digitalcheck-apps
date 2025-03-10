import { type MetaArgs } from "react-router";
import Background from "~/components/Background";
import Container from "~/components/Container";
import Header from "~/components/Header";
import RichText from "~/components/RichText";
import { imprint } from "~/resources/content";
import { ROUTE_IMPRINT } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_IMPRINT.title, matches);
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: imprint.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={imprint.content} />
      </Container>
    </>
  );
}
