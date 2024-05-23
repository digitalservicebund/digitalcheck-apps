import Background from "./Background";
import Container from "./Container";
import RichText from "./RichText";

const BetaBanner = () => {
  return (
    <Background backgroundColor="yellow" paddingTop="16" paddingBottom="16">
      <Container paddingTop="0" paddingBottom="0">
        <RichText
          markdown={`Der Werkzeugfinder befindet sich im Aufbau und wird auf Basis Ihrer Rückmeldung weiterentwickelt. Inhalte werden regelmäßig angepasst und die Funktionalität kann zeitweise eingeschränkt sein.`}
        />
      </Container>
    </Background>
  );
};

export default BetaBanner;
