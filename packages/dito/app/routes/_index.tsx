import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import LabelWithIcon from "@digitalcheck/shared/components/LabelWithIcon";
import { NumberedList } from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText";
import { Link } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";
import { landing } from "resources/content";
import { useFeatureFlag } from "utils/featureFlags";

export default function Index() {
  const showLinksToTools = useFeatureFlag("digitalcheck.show-links-to-tools");
  return (
    <>
      <Background backgroundColor="darkBlue" className="pt-24 pb-24">
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
      <div className="bg-[url('/assets/images/trainings.jpeg')] bg-[0%_35%] bg-cover">
        <Container>
          <div className="max-w-[630px] bg-white px-16 py-28 md:px-80 md:py-40 rounded-lg">
            <Box
              heading={{ text: landing.trainings.title }}
              content={{ markdown: landing.trainings.text }}
              buttons={[landing.trainings.link]}
            />
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
      {showLinksToTools && (
        <Background backgroundColor="midLightBlue">
          <Container>
            <div className="ds-stack-8 scroll-my-40">
              <Heading
                className="max-sm:ds-heading-02-reg"
                tagName="h2"
                text={landing.links.title}
              />
              <RichText markdown={landing.links.subtitle} />
              <div className="flex flex-row max-md:flex-col gap-24 pt-32">
                {landing.links.items.map((item) => (
                  <div key={item.label} className="bg-white p-28 rounded-md">
                    <Box
                      heading={{
                        tagName: "h3",
                        look: "ds-heading-03-bold",
                        text: item.headline.text,
                      }}
                      label={{
                        text: LabelWithIcon({
                          ...item,
                          look: "secondary",
                        }),
                      }}
                      content={{ markdown: item.content }}
                      buttons={item.buttons}
                      className="!justify-between h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Background>
      )}
      <SupportBanner />
      <Background backgroundColor="darkBlue" className="pt-24 pb-24">
        <Container>
          <div className="ds-stack-32 scroll-my-40">
            <Heading tagName="h2" text={landing.principles.title} />
            <ol className="list-unstyled space-y-8">
              {landing.principles.content.map((principle) => (
                <li
                  key={principle}
                  className="first:before:content-none before:content-[''] before:block before:w-1/2 before:mb-8 before:border-t before:border-blue-700"
                >
                  {principle}
                </li>
              ))}
            </ol>
            <Link
              to={landing.principles.link.href}
              className="text-link-white font-bold"
            >
              {landing.principles.link.text}
            </Link>
          </div>
        </Container>
      </Background>
    </>
  );
}
