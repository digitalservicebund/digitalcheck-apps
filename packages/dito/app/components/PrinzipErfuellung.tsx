import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
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
    <div className="space-y-40 my-40">
      {showParagraphs &&
        prinzipErfuellung.Paragraphen.map((paragraph, index) => (
          <div key={index}>
            <div className="flex space-x-8 my-8">
              {paragraph.Tags?.map((tag) => (
                <div className="bg-blue-300 rounded-md text-base" key={tag.Tag}>
                  {tag.Tag}
                </div>
              ))}
            </div>
            <div className="my-8">
              <b>{paragraph.Norm}</b>
            </div>{" "}
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="list-none ds-stack-32 ps-0 relative">
                {paragraph.Regelungstext}
              </p>
            </div>
            <div className="mt-8">
              <DetailsSummary
                title="Warum ist das gut?"
                content={
                  <BlocksRenderer
                    content={paragraph.WarumWichtig}
                  ></BlocksRenderer>
                }
              ></DetailsSummary>
            </div>
          </div>
        ))}
    </div>
  );
}
