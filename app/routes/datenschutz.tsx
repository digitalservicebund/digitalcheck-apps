import { type MetaArgs } from "react-router";
import Background from "~/components/Background";
import Container from "~/components/Container";
import Header from "~/components/Header";
import RichText from "~/components/RichText";
import { privacy } from "~/resources/content";
import { ROUTE_PRIVACY } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_PRIVACY.title, matches);
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: privacy.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={privacy.content} />
      </Container>
    </>
  );
}
