import Background from "@digitalcheck/shared/components/Background";
import { ButtonProps } from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { support } from "resources/content";
import { ROUTE_SUPPORT } from "resources/staticRoutes";
import useFeatureFlag from "utils/featureFlags";
import prependMetaTitle from "utils/metaTitle";

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
              <div className="absolute w-[400px] right-40 bottom-40 p-16 bg-white/70 backdrop-blur rounded-lg">
                <Testimonial />
              </div>
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
      <Background backgroundColor="white">
        <Container>
          <Header
            heading={{
              tagName: "h2",
              text: supportWhat.title,
            }}
            content={{
              markdown: supportWhat.subtitle,
            }}
          />
          <div className="flex">
            {supportWhat.supportTypes.length > 0 &&
              supportWhat.supportTypes.map((supportType) => (
                <div key={supportType.title}>
                  {supportType.icon}
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
      </Background>
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
              <div key={supportType.title}>
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
                    <ButtonContainer buttons={iframeButtons} />
                    <iframe
                      src={supportType.iframe}
                      title={supportType.title}
                      aria-label={supportType.title}
                      className={`w-full mt-32 transition-all duration-700 ${isAppointmentsVisible ? "h-[600px]" : "h-0"}`}
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
          <div>
            {supportOfferings.tabs.length > 0 &&
              supportOfferings.tabs.map((tab) => (
                <div key={`tab-${tab.title}`}>{tab.title}</div>
              ))}
          </div>
          <div>
            {supportOfferings.tabs.length > 0 &&
              supportOfferings.tabs.map((tab) => (
                <div key={tab.title}>
                  {tab.offerings.length > 0 &&
                    tab.offerings.map((offering) => (
                      <Background backgroundColor="blue" key={offering.title}>
                        <Container additionalClassNames="flex gap-16">
                          <div>
                            <Header
                              heading={{
                                tagName: "h3",
                                text: offering.title,
                              }}
                              content={{
                                markdown: offering.text,
                              }}
                            />
                          </div>
                          <div className="w-[360px]">
                            <Background backgroundColor="white">
                              <div className="ds-stack-16 p-32">
                                <Header
                                  heading={{
                                    tagName: "h4",
                                    text: offering.sellingPoints,
                                  }}
                                />
                                {offering.details.length > 0 && (
                                  <div className="ds-stack-16">
                                    {offering.details.map((detail) => (
                                      <div key={detail.title}>
                                        <Heading
                                          tagName="p"
                                          text={detail.title}
                                        />
                                        <RichText markdown={detail.text} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Background>
                          </div>
                        </Container>
                      </Background>
                    ))}
                </div>
              ))}
          </div>
        </Container>
      </Background>
    </>
  );
}
