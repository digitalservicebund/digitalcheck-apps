import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Header from "@digitalcheck/shared/components/Header";
import Image from "@digitalcheck/shared/components/Image";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import InterviewBanner from "components/InterviewBanner";
import {
  collectITSystems,
  responsibleActors,
  siteMeta,
  tasksProcesses,
  technicalFeasibility,
} from "resources/content";
import {
  ROUTE_METHODS,
  ROUTE_METHODS_COLLECT_IT_SYSTEMS,
  ROUTE_METHODS_RESPONSIBLE_ACTORS,
  ROUTE_METHODS_TASKS_PROCESSES,
  ROUTE_METHODS_TECHNICAL_FEASIBILITY,
} from "resources/staticRoutes";

export type TMethodPage = {
  title: string;
  pageTitle: string;
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
    buttons?: {
      text: string;
      href: string;
      look: "primary" | "secondary" | "tertiary" | "ghost";
    }[];
  };
};

export function loader({ params }: LoaderFunctionArgs) {
  const { subPage } = params;
  const route = `${ROUTE_METHODS.url}/${subPage}`;

  let content;

  switch (route) {
    case ROUTE_METHODS_RESPONSIBLE_ACTORS.url:
      content = responsibleActors;
      content.pageTitle = ROUTE_METHODS_RESPONSIBLE_ACTORS.title;
      break;

    case ROUTE_METHODS_TASKS_PROCESSES.url:
      content = tasksProcesses;
      content.pageTitle = ROUTE_METHODS_TASKS_PROCESSES.title;
      break;

    case ROUTE_METHODS_COLLECT_IT_SYSTEMS.url:
      content = collectITSystems;
      content.pageTitle = ROUTE_METHODS_COLLECT_IT_SYSTEMS.title;
      break;

    case ROUTE_METHODS_TECHNICAL_FEASIBILITY.url:
      content = technicalFeasibility;
      content.pageTitle = ROUTE_METHODS_TECHNICAL_FEASIBILITY.title;
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
    return [{ title: `${data.pageTitle} — ${siteMeta.title}` }];
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
              className: "md:text-2xl",
            }}
          ></Header>
        </Container>
      </Background>
      {content.accordion && (
        <Container paddingBottom="0">
          <DetailsSummary
            title={content.accordion.title}
            content={content.accordion.text}
          />
        </Container>
      )}
      <Container additionalClassNames="ds-stack-32">
        <Box
          heading={{ text: content.content.title }}
          label={{ text: content.content.label }}
          content={{ markdown: content.content.text }}
        />
        {content.boxes?.map((box) => (
          // TODO: This is very similar to the markup used in <ListItem /> when a background color is provided.
          // We should probably create a component for this to keep it consistent.
          <div key={box.title}>
            {box.image && (
              <div className="rounded-t-lg overflow-hidden">
                <Background backgroundColor="midBlue">
                  <div className="pt-64 px-96 max-sm:px-16 max-sm:pt-32">
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
                <Box
                  heading={{ text: box.title }}
                  label={{ text: box.label }}
                  content={{ markdown: box.text }}
                  buttons={box.buttons}
                  additionalClassNames="px-96 py-64 max-sm:px-16 max-sm:py-32"
                />
              </Background>
            </div>
          </div>
        ))}
      </Container>
      {content.tip && (
        <Background backgroundColor="yellow">
          <Container>
            <Box
              heading={{ text: content.tip.title }}
              label={{ text: content.tip.label }}
              content={{ markdown: content.tip.text }}
            />
          </Container>
        </Background>
      )}
      {content.support && (
        <Background backgroundColor="blue">
          <Container>
            <Box
              heading={{ text: content.support.title }}
              label={{ text: content.support.label }}
              content={{ markdown: content.support.text }}
            />
          </Container>
        </Background>
      )}
      {content.nextStep && (
        <Container>
          <Box
            heading={{ text: content.nextStep.title }}
            label={{ text: content.nextStep.label }}
            content={{ markdown: content.nextStep.text }}
            buttons={content.nextStep.buttons}
          />
        </Container>
      )}
      <InterviewBanner />
    </>
  );
}
