import type { MetaFunction } from "@remix-run/react";
import Accordion from "~/components/Accordion";
import Background from "~/components/Background";
import Box from "~/components/Box";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import DetailsSummary from "~/components/DetailsSummary";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import Image from "~/components/Image";
import InfoBox from "~/components/InfoBox";
import SupportBanner from "~/components/SupportBanner";
import { PRE_CHECK_START_BUTTON_ID } from "~/resources/constants";
import { general, preCheck } from "~/resources/content";
import { features } from "~/resources/features";
import {
  ROUTE_GENERAL_INFO,
  ROUTE_LANDING,
  ROUTE_PRECHECK,
} from "~/resources/staticRoutes";
import useFeatureFlag from "~/utils/featureFlags";
import prependMetaTitle from "~/utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRECHECK.title, matches);
};

export default function Index() {
  const showLinkToInteroperabilityLandingPage = useFeatureFlag(
    features.showIOLandingPage,
  );
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
                text: general.buttonBack.text,
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
              buttons={
                showLinkToInteroperabilityLandingPage
                  ? [
                      {
                        text: preCheck.start.info.button.text,
                        href: preCheck.start.info.button.href,
                        look: "tertiary",
                        className: "mt-20",
                      },
                    ]
                  : []
              }
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
