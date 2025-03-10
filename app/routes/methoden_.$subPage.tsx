import { type MetaArgs, useLoaderData } from "react-router";

import Background from "~/components/Background";
import Box from "~/components/Box";
import Container from "~/components/Container";
import DetailsSummary from "~/components/DetailsSummary";
import Header from "~/components/Header";
import Image from "~/components/Image";
import InterviewBanner from "~/components/InterviewBanner";
import LabelWithIcon from "~/components/LabelWithIcon";
import RichText from "~/components/RichText";
import allRoutes from "~/resources/allRoutes";
import {
  collectITSystems,
  responsibleActors,
  tasksProcesses,
  technicalFeasibility,
} from "~/resources/content";
import {
  ROUTE_METHODS,
  ROUTE_METHODS_COLLECT_IT_SYSTEMS,
  ROUTE_METHODS_RESPONSIBLE_ACTORS,
  ROUTE_METHODS_TASKS_PROCESSES,
  ROUTE_METHODS_TECHNICAL_FEASIBILITY,
} from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";
import type { Route } from "./+types/methoden_.$subPage";

const contentMap = {
  [ROUTE_METHODS_RESPONSIBLE_ACTORS.title]: responsibleActors,
  [ROUTE_METHODS_TASKS_PROCESSES.title]: tasksProcesses,
  [ROUTE_METHODS_COLLECT_IT_SYSTEMS.title]: collectITSystems,
  [ROUTE_METHODS_TECHNICAL_FEASIBILITY.title]: technicalFeasibility,
};

const notFound = new Response("Method page not found", {
  status: 404,
  statusText: "Not Found",
});

export function loader({ params }: Route.LoaderArgs) {
  const { subPage } = params;
  if (!subPage) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw notFound;
  }

  const route = allRoutes.find((route) => route.url.endsWith(subPage));
  if (!route || !contentMap[route.title]) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw notFound;
  }

  return { route };
}

export const meta: Route.MetaFunction = ({ data, matches }) => {
  return prependMetaTitle(
    data ? data.route.title : ROUTE_METHODS.title,
    matches as MetaArgs["matches"],
  );
};

export default function Index() {
  const { route } = useLoaderData<typeof loader>();
  // We have to get the content here to use the icons from the content file
  const content = contentMap[route.title];

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
          {content.guidance && (
            <RichText
              markdown={content.guidance}
              className="ds-stack-0 mt-24"
            />
          )}
        </Container>
      </Background>
      {"accordion" in content && (
        <Container className="pb-0">
          <DetailsSummary
            title={content.accordion.title}
            content={content.accordion.text}
          />
        </Container>
      )}
      <Container className="ds-stack-32">
        <Box
          heading={{ text: content.content.title, look: "ds-heading-03-reg" }}
          label={{ text: LabelWithIcon(content.content) }}
          content={{ markdown: content.content.text }}
          buttons={"buttons" in content.content ? content.content.buttons : []}
        />
        {content.boxes.map((box) => (
          // TODO: This is very similar to the markup used in <ListItem /> when a background color is provided.
          // We should probably create a component for this to keep it consistent.
          <div key={box.title} className="overflow-hidden rounded-lg">
            <Background backgroundColor="midBlue">
              <div className="px-96 pt-64 max-sm:px-16 max-sm:pt-32">
                <div className="&_img:object-cover &_img:object-top h-0 overflow-hidden rounded-t-lg pb-[40%] shadow-2xl">
                  <Image url={box.image.src} alternativeText={box.image.alt} />
                </div>
              </div>
            </Background>
            <Background backgroundColor="blue">
              <Box
                heading={{ text: box.title, look: "ds-heading-03-reg" }}
                label={{ text: LabelWithIcon(box) }}
                content={{ markdown: box.text }}
                buttons={"buttons" in box ? box.buttons : []}
                className="px-96 py-64 max-sm:px-16 max-sm:py-32"
              />
            </Background>
          </div>
        ))}
      </Container>
      {"tip" in content && (
        <Background backgroundColor="yellow">
          <Container>
            <Box
              heading={{ text: content.tip.title, look: "ds-heading-03-reg" }}
              label={{ text: LabelWithIcon(content.tip) }}
              content={{ markdown: content.tip.text }}
            />
          </Container>
        </Background>
      )}
      {"support" in content && (
        <Background backgroundColor="blue">
          <Container>
            <Box
              heading={{
                text: content.support.title,
                look: "ds-heading-03-reg",
              }}
              label={{ text: LabelWithIcon(content.support) }}
              content={{ markdown: content.support.text }}
              buttons={content.support.buttons}
            />
          </Container>
        </Background>
      )}
      {content.nextStep && (
        <Container>
          <Box
            heading={{
              text: content.nextStep.title,
              look: "ds-heading-03-reg",
            }}
            label={{ text: LabelWithIcon(content.nextStep) }}
            content={{ markdown: content.nextStep.text }}
            buttons={content.nextStep.buttons}
          />
        </Container>
      )}
      <InterviewBanner />
    </>
  );
}
