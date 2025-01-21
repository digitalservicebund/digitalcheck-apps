import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
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
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: preCheck.start.title,
            }}
            content={{
              markdown: preCheck.start.subtitle,
              className: "md:text-2xl",
            }}
          ></Header>
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
          <div className="flex flex-col-reverse items-center gap-48 px-16 py-40 md:flex-row md:gap-64 md:px-64">
            <Image
              url={preCheck.start.info.image.src}
              alternativeText={preCheck.start.info.image.alt}
              className="md:w-1/3 md:pl-32"
            />
            <Box
              heading={{
                tagName: "h3",
                look: "ds-heading-03-reg",
                text: preCheck.start.info.title,
              }}
              content={{
                markdown: preCheck.start.info.text,
              }}
            />
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
