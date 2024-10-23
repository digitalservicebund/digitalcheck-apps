import Container from "@digitalcheck/shared/components/Container.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Prinziperfuellung } from "../utils/strapiData.server.ts";

interface PrinzipienErfuellungProps {
  prinzipienErfuellung: Prinziperfuellung;
}
export default function PrinzipienErfuellung({
  prinzipienErfuellung,
}: PrinzipienErfuellungProps) {
  return (
    <Container
      backgroundColor="blue"
      overhangingBackground
      additionalClassNames="mt-40 mb-48"
    >
      Einschätzung Referat: {prinzipienErfuellung.EinschaetzungReferat} <br />{" "}
      <br />
      <br />
      Paragraphen: <br />
      {prinzipienErfuellung.Paragraphen.map((paragraph) => {
        return (
          <>
            <b>Norm: {paragraph.Norm}</b> <br />
            <br />
            Tags:{" "}
            {paragraph.Tags &&
              paragraph.Tags.length > 0 &&
              paragraph.Tags.map((tag) => <>{tag.Tag} </>)}
            <br /> <br />
            Regelungstext: {paragraph.Regelungstext} <br />
            <br />
            WarumWichtig:{" "}
            <BlocksRenderer content={paragraph.WarumWichtig}></BlocksRenderer>
          </>
        );
      })}
    </Container>
  );
}
