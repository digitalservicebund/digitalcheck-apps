import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import LabelWithIcon from "@digitalcheck/shared/components/LabelWithIcon.tsx";
import { NumberedList } from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText";
import SupportBanner from "components/SupportBanner";
import { header, landing } from "resources/content";
import useFeatureFlag from "../utils/featureFlags.ts";

export default function Index() {
  const showLinksToTools = useFeatureFlag("digitalcheck.show-links-to-tools");
  return (
    <>
      <Background backgroundColor="darkBlue" paddingTop="24" paddingBottom="24">
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
      <Background backgroundColor="yellow">
        <Container paddingTop="10" paddingBottom="10">
          <RichText markdown={header.underConstruction}></RichText>
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
      {/* <Container additionalClassNames="max-sm:!p-0">
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
        <Background
          backgroundColor="midLightBlue"
          paddingTop="0"
          paddingBottom="0"
        >
          <Container>
            <div className="ds-stack-8 gap-8 scroll-my-40">
              <Heading
                className="max-sm:ds-heading-02-reg"
                tagName="h2"
                text={landing.links.title}
              />
              <RichText markdown={landing.links.subtitle} />
              <div className="flex flex-row max-md:flex-col gap-28 pt-32">
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
                      additionalClassNames="!justify-between h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Background>
      )}
      <SupportBanner />
      <Background backgroundColor="darkBlue" paddingTop="24" paddingBottom="24">
        <Container>
          <div className="ds-stack-16 scroll-my-40">
            <Heading tagName="h3" text={landing.principals.title} />
            <RichText
              markdown={landing.principals.content}
              className="!mt-32 !ds-stack-16
              [&_ol]:mb-16
              [&_ol]:!list-none
              [&_ol]:!ml-0
              [&_ol_li+li]:mt-8
              [&_ol_li+li:before]:content-['']
              [&_ol_li+li:before]:block
              [&_ol_li+li:before]:w-1/2
              [&_ol_li+li:before]:mb-8
              [&_ol_li+li:before]:border-t
              [&_ol_li+li:before]:border-blue-700
              "
              // These strange class names are because we are using the Tailwind "arbitrary values" feature to style the list inside this RichText block: https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
            />
          </div>
        </Container>
      </Background>
    </>
  );
}
