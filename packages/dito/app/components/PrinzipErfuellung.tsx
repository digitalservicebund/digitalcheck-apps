import Container from "@digitalcheck/shared/components/Container.tsx";
import DetailInfo from "@digitalcheck/shared/components/DetailInfo.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Prinziperfuellung } from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
  showParagraphs = true,
}: {
  prinzipErfuellung: Prinziperfuellung;
  showParagraphs?: boolean;
}) {
  const detailItems = {
    "Einschätzung des Referats": prinzipErfuellung.EinschaetzungReferat,
    Test: "test",
  };
  return (
    <Container additionalClassNames="mt-40 mb-48">
      <DetailInfo items={detailItems} />
      {showParagraphs &&
        prinzipErfuellung.Paragraphen.map((paragraph, index) => (
          <div key={index}>
            <p>Paragraphen:</p>
            <p>
              <b>Norm: {paragraph.Norm}</b> <br />
            </p>
            Tags: {paragraph.Tags?.map((tag) => <p key={tag.Tag}>{tag.Tag}</p>)}
            <p>Regelungstext: {paragraph.Regelungstext}</p>
            <p>WarumWichtig:</p>
            <BlocksRenderer content={paragraph.WarumWichtig}></BlocksRenderer>
          </div>
        ))}
    </Container>
  );
}
