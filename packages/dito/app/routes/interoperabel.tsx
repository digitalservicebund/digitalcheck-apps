import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import Accordion from "components/Accordion";
import FeedbackForm from "components/FeedbackForm";
import SupportBanner from "components/SupportBanner";
import TableOfContents from "components/TableOfContents";
import { interoperability } from "resources/content";
import { features } from "resources/features";
import { ROUTE_INTEROPERABILITY } from "resources/staticRoutes";
import { twJoin } from "tailwind-merge";
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
          <TableOfContents
            items={[
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
      <Background
        backgroundColor="midBlue"
        className="flex flex-col md:flex-row"
      >
        <Container className="md:ml-auto md:mr-0 md:w-1/2 md:max-w-[calc(59rem/2)]">
          <Heading
            tagName="h2"
            text={interoperability.andDigitalReadiness.headline}
            className="mb-8"
          />
          <RichText markdown={interoperability.andDigitalReadiness.content} />
        </Container>
        <div
          className={twJoin(
            "w-1/2 bg-cover bg-center bg-no-repeat hidden md:block",
            `bg-[url('${interoperability.andDigitalReadiness.image.src}')]`,
          )}
        ></div>
        <Image
          url={interoperability.andDigitalReadiness.image.src}
          alternativeText={interoperability.andDigitalReadiness.image.alt}
          className="h-auto w-full md:hidden"
        />
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
          <Image
            url={interoperability.andPolicyMaking.image.src}
            alternativeText={interoperability.andPolicyMaking.image.alt}
            className="h-auto w-full"
          />
        </Container>
      </div>
      <FeedbackForm />
      <SupportBanner withFeedbackBanner={false} />
    </>
  );
}
