import Background from "@digitalcheck/shared/components/Background";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import {
  collectITSystems,
  responsibleActors,
  siteMeta,
  tasksProcesses,
  technicalFeasibility,
} from "resources/content";
import {
  PATH_METHODS,
  PATH_METHODS_COLLECT_IT_SYSTEMS,
  PATH_METHODS_RESPONSIBLE_ACTORS,
  PATH_METHODS_TASKS_PROCESSES,
  PATH_METHODS_TECHNICAL_FEASIBILITY,
} from "resources/staticRoutes";

export type TMethodPage = {
  title: string;
  subtitle: string;
  accordion?: {
    title: string;
    text: string;
  };
  content: {
    label: string;
    title: string;
    text: string;
  };
  boxes?: {
    image?: {
      src: string;
      alt: string;
    };
    label: string;
    title: string;
    text: string;
    buttons?: { text: string; href: string }[];
  }[];
  tip?: {
    label: string;
    title: string;
    text: string;
  };
  support?: {
    label: string;
    title: string;
    text: string;
  };
  nextStep?: {
    label: string;

    title: string;
    text: string;
    buttons?: { text: string; href: string }[];
  };
};

export function loader({ params }: LoaderFunctionArgs) {
  const { subPage } = params;
  const path = `${PATH_METHODS}/${subPage}`;

  let content;

  switch (path) {
    case PATH_METHODS_RESPONSIBLE_ACTORS:
      content = responsibleActors;
      break;

    case PATH_METHODS_TASKS_PROCESSES:
      content = tasksProcesses;
      break;

    case PATH_METHODS_COLLECT_IT_SYSTEMS:
      content = collectITSystems;
      break;

    case PATH_METHODS_TECHNICAL_FEASIBILITY:
      content = technicalFeasibility;
      break;
  }

  if (!content) {
    throw new Response("Method page not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json(content);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    return [{ title: `${data.title} — ${siteMeta.title}` }];
  }
};

export default function Index() {
  const content = useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: content.title,
            }}
            content={{
              markdown: content.subtitle,
            }}
          ></Header>
        </Container>
      </Background>
      {content.accordion && (
        <Container>
          <DetailsSummary
            title={content.accordion.title}
            content={content.accordion.text}
          />
        </Container>
      )}
      <Container>
        <div className="flex flex-col gap-16">
          <Heading
            tagName="div"
            className="ds-label-section text-gray-900"
            text={content.content.label}
          />
          <Heading tagName="h2" text={content.content.title} />
          <RichText markdown={content.content.text} />
        </div>
      </Container>
      {content.boxes?.map((box) => (
        <Container key={box.title}>
          {box.image && (
            <div className="rounded-t-lg overflow-hidden">
              <Background backgroundColor="midBlue">
                <div className="p-64 pb-0">
                  <div className="rounded-t-lg shadow-2xl overflow-hidden h-0 pb-[40%] &_img:object-cover &_img:object-top">
                    <Image
                      url={box.image.src}
                      alternativeText={box.image.alt}
                    />
                  </div>
                </div>
              </Background>
            </div>
          )}
          <div className="rounded-b-lg overflow-hidden">
            <Background backgroundColor="blue">
              <div className="flex flex-col gap-16 p-64">
                <Heading
                  tagName="div"
                  className="ds-label-section text-gray-900"
                  text={box.label}
                />
                <Heading tagName="h2" text={box.title} />
                <RichText markdown={box.text} />
                {box.buttons && (
                  <ButtonContainer>
                    {box.buttons.map((button) => (
                      <Button key={button.text ?? button.href} {...button} />
                    ))}
                  </ButtonContainer>
                )}
              </div>
            </Background>
          </div>
        </Container>
      ))}
      {content.tip && (
        <Background backgroundColor="yellow">
          <Container>
            <div className="flex flex-col gap-16">
              <Heading
                tagName="div"
                className="ds-label-section text-gray-900"
                text={content.tip.label}
              />
              <Heading tagName="h2" text={content.tip.title} />
              <RichText markdown={content.tip.text} />
            </div>
          </Container>
        </Background>
      )}
      {content.support && (
        <Background backgroundColor="blue">
          <Container>
            <div className="flex flex-col gap-16">
              <Heading
                tagName="div"
                className="ds-label-section text-gray-900"
                text={content.support.label}
              />
              <Heading tagName="h2" text={content.support.title} />
              <RichText markdown={content.support.text} />
            </div>
          </Container>
        </Background>
      )}
      {content.nextStep && (
        <Container>
          <div className="flex flex-col gap-16">
            <Heading
              tagName="div"
              className="ds-label-section text-gray-900"
              text={content.nextStep.label}
            />
            <Heading tagName="h2" text={content.nextStep.title} />
            <RichText markdown={content.nextStep.text} />
            {content.nextStep.buttons && (
              <ButtonContainer>
                {content.nextStep.buttons.map((button) => (
                  <Button key={button.text ?? button.href} {...button} />
                ))}
              </ButtonContainer>
            )}
          </div>
        </Container>
      )}
      <FeedbackBanner />
    </>
  );
}
