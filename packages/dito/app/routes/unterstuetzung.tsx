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

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_SUPPORT.title, matches);
};

export default function Index() {
  const supportOfferingFlag = useFeatureFlag(
    "digitalcheck.test-support-offering",
  );
  const [isAppointmentsVisible, setIsAppointmentsVisible] = useState(false);

  const iframeButtons = [
    supportOfferingFlag && {
      ...support.supportHow.supportTypes[1].buttons[0],
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
              text: support.title,
            }}
            content={{
              markdown: support.subtitle,
              className: "md:text-2xl",
            }}
          />
        </Container>
      </Background>
      <Background backgroundColor="midBlue">
        <Container additionalClassNames="flex gap-16">
          <RichText
            markdown={support.socialProof.text}
            className="text-3xl w-[360px]"
          />
          <div className="relative">
            <div className="absolute">
              <Image
                url={support.socialProof.image.src}
                alternativeText={support.socialProof.image.alt}
              />
            </div>
            <div>
              <RichText markdown={support.socialProof.testimonials[0].quote} />
              <RichText
                markdown={support.socialProof.testimonials[0].position}
              />
              <RichText
                markdown={support.socialProof.testimonials[0].ministry}
              />
            </div>
          </div>
        </Container>
      </Background>
      <Background backgroundColor="white">
        <Container>
          <Header
            heading={{
              tagName: "h2",
              text: support.supportWhat.title,
            }}
            content={{
              markdown: support.supportWhat.subtitle,
            }}
          />
          <div className="flex">
            {support.supportWhat.supportTypes.length > 0 &&
              support.supportWhat.supportTypes.map((supportType) => (
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
              text: support.supportHow.title,
            }}
          />
          {support.supportHow.supportTypes.length > 0 &&
            support.supportHow.supportTypes.map((supportType) => (
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
              text: support.supportOfferings.title,
            }}
            content={{
              markdown: support.supportOfferings.text,
            }}
          />
          <div>
            {support.supportOfferings.tabs.length > 0 &&
              support.supportOfferings.tabs.map((tab) => (
                <div key={`tab-${tab.title}`}>{tab.title}</div>
              ))}
          </div>
          <div>
            {support.supportOfferings.tabs.length > 0 &&
              support.supportOfferings.tabs.map((tab) => (
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
