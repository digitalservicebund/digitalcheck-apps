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
    <div className="mt-24">
      <h1>Start Paragraphs</h1>
      <p className="my-24 bg-gray-100 pl-16">
        Einschätzung des Referats:{" "}
        <b>{prinzipErfuellung.EinschaetzungReferat}</b>
      </p>
      {showParagraphs &&
        prinzipErfuellung.Paragraphen.map((paragraph, index) => (
          <div key={index}>
            <div className="flex space-x-8">
              {paragraph.Tags?.map((tag) => (
                <div className="bg-blue-300 rounded-md text-base" key={tag.Tag}>
                  {tag.Tag}
                </div>
              ))}
            </div>
            <p>
              <b>{paragraph.Norm}</b>
            </p>{" "}
            <p>Regelungstext: {paragraph.Regelungstext}</p>
            <p>WarumWichtig:</p>
            <BlocksRenderer content={paragraph.WarumWichtig}></BlocksRenderer>
          </div>
        ))}
    </div>
  );
}
