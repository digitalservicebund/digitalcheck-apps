import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import RichText from "@digitalcheck/shared/components/RichText";
import type { MetaFunction } from "@remix-run/react";
import Accordion from "components/Accordion";
import SupportBanner from "components/SupportBanner";
import { PRE_CHECK_START_BUTTON_ID } from "resources/constants";
import { preCheck } from "resources/content";
import {
  ROUTE_GENERAL_INFO,
  ROUTE_LANDING,
  ROUTE_PRECHECK,
} from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRECHECK.title, matches);
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container className="pt-64 pb-56 max-sm:!py-32">
          <Box
            heading={{
              tagName: "h1",
              text: preCheck.start.title,
            }}
            content={{
              markdown: preCheck.start.subtitle,
              className: "md:text-2xl",
            }}
          ></Box>
        </Container>
        <Container className="pt-0">
          <div className="ds-stack-16 mb-40">
            {preCheck.start.hints.map((hint) => (
              <DetailsSummary
                key={hint.title}
                title={hint.title}
                content={hint.text}
              />
            ))}
          </div>
          <ButtonContainer
            buttons={[
              {
                id: PRE_CHECK_START_BUTTON_ID,
                text: preCheck.start.buttonText,
                href: ROUTE_GENERAL_INFO.url,
                type: "submit",
              },
              {
                id: "preCheck-back-button",
                text: "Zurück",
                href: ROUTE_LANDING.url,
                look: "tertiary",
              },
            ]}
          />
        </Container>
      </Background>
      <Container>
        <InfoBox
          heading={{
            text: preCheck.start.summary.title,
            tagName: "h2",
          }}
          items={preCheck.start.summary.items}
        ></InfoBox>
      </Container>
      <Container className="pt-0">
        <Background backgroundColor="blue">
          <div className="px-64 py-40 flex gap-64 items-center max-sm:flex-col-reverse max-sm:px-16 max-sm:gap-48">
            <div className="md:pl-32 ds-stack-8 gap-20 md:w-1/3">
              <Image
                url={preCheck.start.info.image.src}
                alternativeText={preCheck.start.info.image.alt}
              />
            </div>
            <div>
              <Heading
                tagName="h3"
                look="ds-heading-03-reg"
                text={preCheck.start.info.title}
              />
              <RichText markdown={preCheck.start.info.text} />
            </div>
          </div>
        </Background>
      </Container>
      <Container>
        <Heading
          tagName="h2"
          look="ds-heading-02-reg text-center mb-64 max-sm:mb-56"
          text={preCheck.faq.title}
        />
        <Accordion items={preCheck.faq.items} />
      </Container>
      <SupportBanner />
    </>
  );
}
