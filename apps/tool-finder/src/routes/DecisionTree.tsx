import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

import { PATH_RESULT } from "./";

function DecisionTree() {
  useTitle("Entscheidungsbaum Anleitung");

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Entscheidungsbaum Anleitung",
            }}
          ></Header>
        </Container>
      </Background>
      <Container paddingTop="48" paddingBottom="48">
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
