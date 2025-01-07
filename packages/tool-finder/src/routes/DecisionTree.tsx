import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import useTitle from "services/useTitle";

import { PATH_RESULT } from "./";

function DecisionTree() {
  useTitle("Entscheidungsbaum Anleitung");

  return (
    <>
      <Background backgroundColor="blue" className="pt-48 pb-48">
        <Container className="pt-0 pb-0">
          <Header
            heading={{
              tagName: "h1",
              text: "Entscheidungsbaum Anleitung",
            }}
          ></Header>
        </Container>
      </Background>
      <Container className="pt-48 pb-48">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-heading-03-bold",
            text: "Diese Seite befindet sich im Aufbau",
          }}
          content={{
            markdown: `Diese Seite befindet sich momentan noch im Aufbau und Inhalte folgen in Kürze.`,
          }}
          buttons={[
            {
              id: "diagram-guide-page-back-button",
              text: "Zurück",
              href: PATH_RESULT,
            },
          ]}
        ></Box>
      </Container>
    </>
  );
}

export default DecisionTree;
