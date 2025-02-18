import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { Link, MetaFunction } from "@remix-run/react";
import Accordion from "components/Accordion";
import FeedbackForm from "components/FeedbackForm";
import LinkListBox from "components/LinkListBox";
import SupportBanner from "components/SupportBanner";
import { interoperability } from "resources/content";
import { features } from "resources/features";
import { ROUTE_INTEROPERABILITY } from "resources/staticRoutes";
import { useFeatureFlag } from "utils/featureFlags";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_INTEROPERABILITY.title, matches);
};

export default function Interoperability() {
  const showPage = useFeatureFlag(features.showIOLandingPage);

  if (!showPage) {
    throw new Response("Feature is not enabled for this environment", {
      status: 404,
    });
  }

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: interoperability.headline,
            }}
            content={{
              markdown: interoperability.content,
              className: "md:text-2xl",
            }}
          ></Header>
          <LinkListBox
            links={[
              {
                id: interoperability.faq.id,
                title: interoperability.faq.headline,
              },
              {
                id: interoperability.resources.id,
                title: interoperability.resources.headline,
              },
              {
                id: interoperability.andPolicyMaking.id,
                title: interoperability.andPolicyMaking.headline,
              },
            ]}
          />
        </Container>
      </Background>
      <Background backgroundColor="midBlue">
        <Container className="flex flex-col py-0 lg:h-[420px] lg:flex-row">
          <div className="py-32 sm:py-48 lg:w-1/2 lg:self-center lg:pr-48">
            <Heading
              tagName="h2"
              text={interoperability.andDigitalReadiness.headline}
              className="mb-8"
            />
            <RichText markdown={interoperability.andDigitalReadiness.content} />
          </div>
          <div className="relative max-lg:mb-48 max-sm:hidden lg:w-1/2">
            <div className="w-[630px] bg-[#cce5ef] lg:w-[50vw] [&>img]:object-contain [&>img]:lg:h-[420px]">
              <Image
                url={interoperability.andDigitalReadiness.image.src}
                alternativeText={interoperability.andDigitalReadiness.image.alt}
              />
            </div>
          </div>
        </Container>
        <div className="sm:hidden">
          <Image
            url={interoperability.andDigitalReadiness.image.src}
            alternativeText={interoperability.andDigitalReadiness.image.alt}
          />
        </div>
      </Background>
      <div id={interoperability.faq.id}>
        <Container>
          <Heading
            tagName="h2"
            text={interoperability.faq.headline}
            className="mb-8"
          />
          <RichText markdown={interoperability.faq.content} className="mb-40" />
          <Accordion items={interoperability.faq.items} />
        </Container>
      </div>
      <div id={interoperability.resources.id}>
        <Background backgroundColor="blue" className="pb-48 pt-40">
          <Container backgroundColor="white" overhangingBackground>
            <Heading
              tagName="h2"
              text={interoperability.resources.headline}
              className="mb-8"
            />
            <p>{interoperability.resources.subtitle}</p>
            {interoperability.resources.groups.map((group) => (
              <div key={group.title} className="mt-10 p-24 pl-0">
                <div className="mb-10 flex items-center">
                  <group.icon className="mr-10 size-32" />
                  <Heading
                    tagName="h3"
                    look="ds-label-01-bold"
                    text={group.title}
                  />
                </div>
                <p className="mb-20">{group.subtitle}</p>
                <RichText markdown={group.content} />
              </div>
            ))}
          </Container>
        </Background>
      </div>
      <div id={interoperability.andPolicyMaking.id}>
        <Container>
          <Heading
            tagName="h2"
            text={interoperability.andPolicyMaking.headline}
            className="mb-8"
          />
          <RichText
            markdown={interoperability.andPolicyMaking.content}
            className="mb-40"
          />
          <Link
            to={interoperability.andPolicyMaking.image.src}
            reloadDocument
            target="_blank"
            rel="noreferrer"
            className="relative block cursor-zoom-in"
          >
            <Image
              url={interoperability.andPolicyMaking.image.src}
              alternativeText={interoperability.andPolicyMaking.image.alt}
              className="h-auto w-full"
            />
            <ZoomInOutlined
              className="absolute bottom-16 left-16 size-48 bg-blue-800 p-1 shadow"
              fill="white"
            />
          </Link>
        </Container>
      </div>
      <FeedbackForm {...interoperability.feedbackForm} />
      <SupportBanner withFeedbackBanner={false} />
    </>
  );
}
