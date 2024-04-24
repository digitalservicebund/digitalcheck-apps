import Background from "../components/Background";
import Box from "../components/Box";
import Container from "../components/Container";
import Header from "../components/Header";
import useTitle from "../services/useTitle";

function MaintenanceModePage() {
  useTitle();

  return (
    <>
      <Background backgroundColor="blue" paddingTop="48" paddingBottom="48">
        <Container paddingTop="0" paddingBottom="0">
          <Header
            heading={{
              tagName: "h1",
              text: "Werkzeugfinder für Visualisierungen",
            }}
          ></Header>
        </Container>
      </Background>
      <Container paddingTop="48" paddingBottom="48">
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
