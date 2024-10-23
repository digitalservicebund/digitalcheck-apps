import Container from "@digitalcheck/shared/components/Container.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Prinziperfuellung } from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
  showParagraphs = true,
}: {
  prinzipErfuellung: Prinziperfuellung;
  showParagraphs?: boolean;
}) {
  return (
    <Container
      backgroundColor="blue"
      overhangingBackground
      additionalClassNames="mt-40 mb-48"
    >
      <p>Einschätzung Referat: {prinzipErfuellung.EinschaetzungReferat} </p>

      {showParagraphs &&
        prinzipErfuellung.Paragraphen.map((paragraph) => (
          <>
            <p>Paragraphen:</p>
            <p>
              <b>Norm: {paragraph.Norm}</b> <br />
            </p>
            <br />
            Tags: {paragraph.Tags?.map((tag) => tag.Tag)}
            <br /> <br />
            <p>Regelungstext: {paragraph.Regelungstext}</p>
            <p>WarumWichtig:</p>
            <BlocksRenderer content={paragraph.WarumWichtig}></BlocksRenderer>
          </>
        ))}
    </Container>
  );
}
