import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import useTitle from "services/useTitle";

import { PATH_RESULT } from "./";

function Diagram() {
  useTitle("Schaubild Anleitung");

  return (
    <>
      <Background backgroundColor="blue" className="py-48">
        <Container className="py-0">
          <Header
            heading={{
              tagName: "h1",
              text: "Schaubild Anleitung",
            }}
          ></Header>
        </Container>
      </Background>
      <Container className="py-48">
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

export default Diagram;
