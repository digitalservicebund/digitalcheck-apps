import Background from "@digitalcheck/shared/components/Background";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { NumberedList } from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";
import { documentation, header } from "resources/content";
import { ROUTE_DOCUMENTATION } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_DOCUMENTATION.title, matches);
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: documentation.title,
            }}
            content={{
              markdown: documentation.subtitle,
              className: "md:text-2xl",
            }}
          />
          <ButtonContainer className="mt-48" buttons={documentation.buttons} />
        </Container>
      </Background>
      <Background backgroundColor="yellow">
        <Container paddingTop="10" paddingBottom="10">
          <RichText markdown={header.underConstruction}></RichText>
        </Container>
      </Background>
      <Container additionalClassNames="max-sm:!p-0">
        <InlineNotice
          look="warning"
          title={documentation.multipleNotice.headline}
          tagName="h2"
          content={documentation.multipleNotice.content}
        />
      </Container>
      <Container>
        <InfoBox
          heading={{
            tagName: "h2",
            text: documentation.summary.title,
          }}
          items={documentation.summary.items}
        />
      </Container>
      <Container>
        <NumberedList
          heading={{
            tagName: "h2",
            text: documentation.nextSteps.title,
          }}
          items={documentation.nextSteps.items}
        />
      </Container>
      <SupportBanner />
    </>
  );
}
