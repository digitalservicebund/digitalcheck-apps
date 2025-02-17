import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import { NumberedList } from "@digitalcheck/shared/components/List";
import { Link } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";
import { landing } from "resources/content";
import { features } from "resources/features";
import useFeatureFlag from "utils/featureFlags";

export default function Index() {
  const showInteroperabilitySection = useFeatureFlag(
    features.showIOLandingPage,
  );

  return (
    <>
      <Background backgroundColor="darkBlue" className="py-24">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: landing.title,
            }}
            content={{
              markdown: landing.subtitle,
              className: "md:text-2xl",
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <NumberedList
          heading={{
            tagName: "h2",
            text: landing.list.title,
          }}
          items={landing.list.items}
        />
      </Container>
      {/* <Container className="max-sm:!p-0">
        <InlineNotice
          look="warning"
          title={landing.dataNotice.headline}
          tagName="h2"
          content={landing.dataNotice.content}
        />
      </Container> */}
      <div className="bg-[url('/assets/images/trainings.jpeg')] bg-cover bg-[0%_35%]">
        <Container>
          <div className="max-w-[630px] rounded-lg bg-white px-16 py-28 md:px-80 md:py-40">
            {showInteroperabilitySection ? (
              <Box
                heading={{ text: landing.interoperability.title }}
                content={{ markdown: landing.interoperability.text }}
                buttons={[landing.interoperability.link]}
              />
            ) : (
              <Box
                heading={{ text: landing.trainings.title }}
                content={{ markdown: landing.trainings.text }}
                buttons={[landing.trainings.link]}
              />
            )}
          </div>
        </Container>
      </div>
      <Container>
        <InfoBox
          heading={{
            tagName: "h2",
            text: landing.summary.title,
          }}
          items={landing.summary.items}
        />
      </Container>
      <SupportBanner />
      <Background backgroundColor="darkBlue" className="py-24">
        <Container>
          <div className="ds-stack-32 scroll-my-40">
            <Heading tagName="h2" text={landing.principles.title} />
            <ol className="list-unstyled space-y-8">
              {landing.principles.content.map((principle) => (
                <li
                  key={principle}
                  className="before:mb-8 before:block before:w-1/2 before:border-t before:border-blue-700 before:content-[''] first:before:content-none"
                >
                  {principle}
                </li>
              ))}
            </ol>
            <Link
              to={landing.principles.link.href}
              className="text-link font-bold"
            >
              {landing.principles.link.text}
            </Link>
          </div>
        </Container>
      </Background>
    </>
  );
}
