import { useState } from "react";
import { type MetaArgs } from "react-router";
import { twJoin } from "tailwind-merge";

import Background from "~/components/Background";
import Box from "~/components/Box";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import Image from "~/components/Image";
import RichText from "~/components/RichText";
import { support } from "~/resources/content";
import { ROUTE_SUPPORT } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";
import SupportTabs from "./SupportTabList";

const {
  socialProof,
  supportHow,
  supportWhat,
  supportOfferings,
  title,
  subtitle,
} = support;

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_SUPPORT.title, matches);
};

function Testimonial() {
  return (
    <>
      <p className="-mb-20 text-6xl text-blue-600">&ldquo;</p>
      <RichText
        markdown={socialProof.testimonials[0].quote}
        className="text-base"
      />
      <RichText
        markdown={socialProof.testimonials[0].position}
        className="mt-8 text-base font-bold"
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
  const [isAppointmentsVisible, setIsAppointmentsVisible] = useState(false);

  const iframeButtons = [
    {
      ...supportHow.supportTypes[1].buttons[0],
      onClick: () => setIsAppointmentsVisible(true),
    },
  ];

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
        <Container className="flex flex-col py-0 lg:h-[420px] lg:flex-row">
          <div className="py-32 sm:py-48 lg:w-1/2 lg:self-center">
            <RichText
              markdown={socialProof.text}
              className="w-[370px] text-2xl leading-10 sm:text-3xl sm:max-lg:w-[480px]"
            />
          </div>
          <div className="relative max-lg:mb-48 max-sm:hidden lg:w-1/2">
            <div className="w-[630px] lg:w-[50vw] [&>img]:lg:h-[420px] [&>img]:lg:w-full [&>img]:lg:object-none [&>img]:lg:object-[10%_75%]">
              <SocialProofImage />
            </div>
            <div className="absolute bottom-40 left-40 max-w-[400px] rounded-lg bg-white/70 p-16 backdrop-blur max-lg:hidden">
              <Testimonial />
            </div>
          </div>
        </Container>
      </Background>
      <div className="sm:hidden">
        <SocialProofImage />
      </div>
      <Container className="lg:hidden">
        <Testimonial />
      </Container>
      <Container className="pt-48">
        <Box
          heading={{
            tagName: "h2",
            text: supportWhat.title,
          }}
          content={{
            markdown: supportWhat.subtitle,
          }}
        />
        <div className="mt-40 flex gap-32 max-sm:flex-col">
          {supportWhat.supportTypes.length > 0 &&
            supportWhat.supportTypes.map((supportType) => (
              <div
                key={supportType.title}
                className="flex gap-16 max-lg:flex-col"
              >
                <supportType.icon className="size-48 flex-none fill-blue-800" />
                <Box
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
          <Heading tagName="h2" text={supportHow.title} />
          {supportHow.supportTypes.length > 0 &&
            supportHow.supportTypes.map((supportType) => (
              <div key={supportType.title} className="ds-stack-16 pb-40 pt-32">
                <Box
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
                      className={twJoin(
                        "mt-32 w-full transition-all duration-700",
                        isAppointmentsVisible ? "h-[600px]" : "hidden h-0",
                      )}
                    ></iframe>
                  </>
                ) : (
                  <ButtonContainer buttons={supportType.buttons} />
                )}
              </div>
            ))}
        </Container>
      </Background>
      <div id="angebote">
        <Background backgroundColor="white">
          <Container>
            <Box
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
      </div>
    </>
  );
}
