import { Absatz, Prinziperfuellung } from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
  absatz,
}: {
  prinzipErfuellung: Prinziperfuellung;
  absatz: Absatz;
}) {
  console.log(absatz);
  console.log(prinzipErfuellung);
  return (
    <div className="space-y-40 my-40">
      {/*
      // TODO
*/}
      {/*      {absatz.Text.map((paragraph) => (
        <div key={paragraph.Norm} className="ds-stack-8">
          <span className="ds-label-01-bold">{paragraph.Norm}</span>
          <RichText
            markdown={paragraph.Regelungstext}
            className="border-l-4 border-gray-300 pl-8"
            rendererOptions={{
              del: ({ text }) => `<mark class="bg-yellow-300">${text}</mark>`,
            }}
          />
          <DetailsSummary
            title="Warum ist das gut?"
            content={<BlocksRenderer content={paragraph.WarumWichtig} />}
          ></DetailsSummary>
        </div>
      ))}*/}
    </div>
  );
}
