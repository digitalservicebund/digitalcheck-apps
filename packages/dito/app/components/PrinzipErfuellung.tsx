import Container from "@digitalcheck/shared/components/Container.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Prinziperfuellung } from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
}: {
  prinzipErfuellung: Prinziperfuellung;
}) {
  return (
    <Container
      backgroundColor="blue"
      overhangingBackground
      additionalClassNames="mt-40 mb-48"
    >
      Einschätzung Referat: {prinzipErfuellung.EinschaetzungReferat} <br />
      <br />
      <br />
      Paragraphen: <br />
      {prinzipErfuellung.Paragraphen.map((paragraph) => (
        <>
          <p>
            <b>Norm: {paragraph.Norm}</b> <br />
          </p>
          <br />
          Tags: {paragraph.Tags?.map((tag) => tag.Tag)}
          <br /> <br />
          Regelungstext: {paragraph.Regelungstext} <br />
          <br />
          WarumWichtig:
          <BlocksRenderer content={paragraph.WarumWichtig}></BlocksRenderer>
        </>
      ))}
    </Container>
  );
}
