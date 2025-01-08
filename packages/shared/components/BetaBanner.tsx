import Background from "./Background";
import Container from "./Container";
import RichText from "./RichText";

const BetaBanner = () => {
  return (
    <Background backgroundColor="yellow" className="pt-16 pb-16">
      <Container className="pt-0 pb-0">
        <RichText
          markdown={`Der Werkzeugfinder befindet sich im Aufbau und wird auf Basis Ihrer Rückmeldung weiterentwickelt. Inhalte werden regelmäßig angepasst und die Funktionalität kann zeitweise eingeschränkt sein.`}
        />
      </Container>
    </Background>
  );
};

export default BetaBanner;
