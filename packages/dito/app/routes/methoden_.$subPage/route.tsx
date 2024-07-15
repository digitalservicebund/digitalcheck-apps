import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
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

export const meta: MetaFunction = () => {
  return [{ title: `${tasksProcesses.title} — ${siteMeta.title}` }];
};

export type TMethodPage = {
  title: string;
  subtitle: string;
  accordion?: {
    title: string;
    text: string;
  };
  content?: {
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
      <FeedbackBanner />
    </>
  );
}
