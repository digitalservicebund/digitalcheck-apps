import { type MetaArgs } from "react-router";
import Background from "~/components/Background";
import Container from "~/components/Container";
import Header from "~/components/Header";
import RichText from "~/components/RichText";
import { accessibility } from "~/resources/content";
import { ROUTE_A11Y } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_A11Y.title, matches);
};

export default function Accessibility() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: accessibility.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={accessibility.content} />
      </Container>
    </>
  );
}
