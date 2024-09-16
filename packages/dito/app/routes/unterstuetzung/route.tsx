import Background from "@digitalcheck/shared/components/Background";
import { ButtonProps } from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { support } from "resources/content";
import { ROUTE_SUPPORT } from "resources/staticRoutes";
import { useFeatureFlag } from "utils/featureFlags";
import prependMetaTitle from "utils/metaTitle";
import SupportTabs from "./SupportTabList";

const {
  socialProof,
  supportHow,
  supportWhat,
  supportOfferings,
  title,
  subtitle,
} = support;

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_SUPPORT.title, matches);
};

function Testimonial() {
  return (
    <>
      <p className="text-6xl -mb-20 text-blue-600">&ldquo;</p>
      <RichText
        markdown={socialProof.testimonials[0].quote}
        className="text-base"
      />
      <RichText
        markdown={socialProof.testimonials[0].position}
        className="text-base font-bold mt-8"
      />
      <RichText
        markdown={socialProof.testimonials[0].ministry}
        className="text-base font-bold text-gray-800"
      />
    </>
  );
}

function SocialProofImage() {
  const { image } = socialProof;
  return <Image url={image.src} alternativeText={image.alt} />;
}

export default function Index() {
  const supportOfferingFlag = useFeatureFlag(
    "digitalcheck.test-support-offering",
  );
  const [isAppointmentsVisible, setIsAppointmentsVisible] = useState(false);

  const iframeButtons = [
    supportOfferingFlag && {
      ...supportHow.supportTypes[1].buttons[0],
      onClick: () => setIsAppointmentsVisible(true),
    },
  ].filter(Boolean) as ButtonProps[];

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: title,
            }}
            content={{
              markdown: subtitle,
              className: "md:text-2xl",
            }}
          />
        </Container>
      </Background>
      <Background backgroundColor="midBlue">
        <Container
          paddingTop="0"
          paddingBottom="0"
          additionalClassNames="flex flex-col xl:flex-row xl:h-[420px]"
        >
          <div className="py-48 xl:w-1/2 xl:self-center">
            <RichText
              markdown={socialProof.text}
              className="text-3xl leading-10 w-[370px]"
            />
          </div>
          <div className="max-sm:hidden relative max-xl:mb-48 xl:w-1/2">
            <div className="xl:absolute xl:top-0 xl:left-0 xl:bottom-0 xl:w-[50vw] xl:overflow-y-hidden">
              <SocialProofImage />
            </div>
            <div className="absolute left-40 bottom-40 max-w-[400px] p-16 bg-white/70 backdrop-blur rounded-lg">
              <Testimonial />
            </div>
          </div>
        </Container>
      </Background>
      <div className="sm:hidden">
        <SocialProofImage />
        <Container>
          <Testimonial />
        </Container>
      </div>
      <Container paddingTop="48">
        <Header
          heading={{
            tagName: "h2",
            text: supportWhat.title,
          }}
          content={{
            markdown: supportWhat.subtitle,
          }}
        />
        <div className="flex max-sm:flex-col mt-40 gap-32">
          {supportWhat.supportTypes.length > 0 &&
            supportWhat.supportTypes.map((supportType) => (
              <div
                key={supportType.title}
                className="flex max-lg:flex-col gap-16"
              >
                <supportType.icon className="w-48 h-48 flex-none fill-blue-800" />
                <Header
                  heading={{
                    tagName: "h3",
                    text: supportType.title,
                  }}
                  content={{
                    markdown: supportType.text,
                  }}
                />
              </div>
            ))}
        </div>
      </Container>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h2",
              text: supportHow.title,
            }}
          />
          {supportHow.supportTypes.length > 0 &&
            supportHow.supportTypes.map((supportType) => (
              <div key={supportType.title} className="ds-stack-16 pt-32 pb-40">
                <Header
                  heading={{
                    tagName: "h3",
                    text: supportType.title,
                  }}
                  content={{
                    markdown: supportType.text,
                  }}
                />
                {supportType.iframe ? (
                  <>
                    <ButtonContainer
                      buttons={iframeButtons}
                      className={isAppointmentsVisible ? "hidden" : ""}
                    />
                    <iframe
                      src={supportType.iframe}
                      title={supportType.title}
                      aria-label={supportType.title}
                      className={`w-full mt-32 transition-all duration-700 ${isAppointmentsVisible ? "h-[600px]" : "hidden h-0"}`}
                    ></iframe>
                  </>
                ) : (
                  <ButtonContainer buttons={supportType.buttons} />
                )}
              </div>
            ))}
        </Container>
      </Background>
      <Background backgroundColor="white">
        <Container>
          <Header
            heading={{
              tagName: "h2",
              text: supportOfferings.title,
            }}
            content={{
              markdown: supportOfferings.text,
            }}
          />
          <SupportTabs />
        </Container>
      </Background>
    </>
  );
}