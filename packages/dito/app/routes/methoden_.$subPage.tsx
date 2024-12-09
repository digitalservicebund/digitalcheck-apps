import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary";
import Header from "@digitalcheck/shared/components/Header";
import Image from "@digitalcheck/shared/components/Image";
import LabelWithIcon from "@digitalcheck/shared/components/LabelWithIcon.tsx";
import RichText from "@digitalcheck/shared/components/RichText";
import { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import InterviewBanner from "components/InterviewBanner";
import allRoutes from "resources/allRoutes.ts";
import {
  collectITSystems,
  responsibleActors,
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
import prependMetaTitle from "utils/metaTitle";

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

export function loader({ params }: LoaderFunctionArgs) {
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

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  return prependMetaTitle(
    data ? data.route.title : ROUTE_METHODS.title,
    matches,
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
              className="mt-24 ds-stack-0"
            />
          )}
        </Container>
      </Background>
      {"accordion" in content && (
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
          label={{
            text: LabelWithIcon(content.content),
          }}
          content={{ markdown: content.content.text }}
          buttons={"buttons" in content.content ? content.content.buttons : []}
        />
        {content.boxes.map((box) => (
          // TODO: This is very similar to the markup used in <ListItem /> when a background color is provided.
          // We should probably create a component for this to keep it consistent.
          <div key={box.title} className="rounded-lg overflow-hidden">
            <Background backgroundColor="midBlue">
              <div className="pt-64 px-96 max-sm:px-16 max-sm:pt-32">
                <div className="rounded-t-lg shadow-2xl overflow-hidden h-0 pb-[40%] &_img:object-cover &_img:object-top">
                  <Image url={box.image.src} alternativeText={box.image.alt} />
                </div>
              </div>
            </Background>
            <Background backgroundColor="blue">
              <Box
                heading={{ text: box.title }}
                label={{ text: LabelWithIcon(box) }}
                content={{ markdown: box.text }}
                buttons={"buttons" in box ? box.buttons : []}
                additionalClassNames="px-96 py-64 max-sm:px-16 max-sm:py-32"
              />
            </Background>
          </div>
        ))}
      </Container>
      {"tip" in content && (
        <Background backgroundColor="yellow">
          <Container>
            <Box
              heading={{ text: content.tip.title }}
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
              heading={{ text: content.support.title }}
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
            heading={{ text: content.nextStep.title }}
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
