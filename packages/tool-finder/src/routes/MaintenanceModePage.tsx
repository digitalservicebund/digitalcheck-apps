import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import useTitle from "services/useTitle";

function MaintenanceModePage() {
  useTitle();

  return (
    <>
      <Background backgroundColor="blue" className="py-48">
        <Container className="py-0">
          <Header
            heading={{
              tagName: "h1",
              text: "Werkzeugfinder für Visualisierungen",
            }}
          ></Header>
        </Container>
      </Background>
      <Container className="py-48">
        <Box
          heading={{
            tagName: "h2",
            text: "Diese Seite ist momentan nicht verfügbar",
          }}
          content={{
            markdown: `Der Werkzeugfinder für Visualisierungen ist momentan leider nicht verfügbar.`,
          }}
        ></Box>
      </Container>
    </>
  );
}

export default MaintenanceModePage;
