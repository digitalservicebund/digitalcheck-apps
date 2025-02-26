import Background from "./Background";
import Container from "./Container";
import RichText from "./RichText";

const BetaBanner = () => {
  return (
    <Background backgroundColor="yellow" className="py-16">
      <Container className="py-0">
        <RichText
          markdown={`Der Werkzeugfinder wird aktuell nicht weiterentwickelt. Dargestellte Informationen sind möglicherweise überholt.`}
        />
      </Container>
    </Background>
  );
};

export default BetaBanner;
