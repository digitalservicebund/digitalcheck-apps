import Background from "./Background";
import Container from "./Container";
import RichText from "./RichText";

const BetaBanner = () => {
  return (
    <Background backgroundColor="yellow" className="pt-16 pb-16">
      <Container className="pt-0 pb-0">
        <RichText
          markdown={`Der Werkzeugfinder wird aktuell nicht weiterentwickelt. Dargestellte Informationen sind möglicherweise überholt.`}
        />
      </Container>
    </Background>
  );
};

export default BetaBanner;
