import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations } from "../resources/content.ts";
import { Visualisierung } from "../utils/strapiData.server.ts";
import { formatDate } from "../utils/utilFunctions.ts";

const LabelValuePair = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="space-x-8">
      <span>{label}</span>
      <span className="ds-label-01-bold">{value}</span>
    </div>
  ) : null;

const VisualisationItem = ({
  visualisierung,
}: {
  visualisierung: Visualisierung;
}) => (
  <div className="flex max-sm:flex-col mt-16 gap-32 pb-16 rich-text">
    <div className="w-1/2 max-sm:px-16 max-sm:pt-32">
      <a
        href={visualisierung.Bild.url}
        target="_blank"
        className="block relative border border-blue-500 aspect-square overflow-hidden"
        rel="noreferrer"
      >
        <Image
          url={visualisierung.Bild.url}
          alternativeText={visualisierung.Bild.alternativeText}
          className="w-full h-full object-cover"
        />
        <ZoomInOutlined
          className="absolute bottom-16 left-16 bg-blue-800 p-1 shadow"
          fill="white"
        />
      </a>

      <div className="p-12 bg-gray-100">
        <LabelValuePair
          label={regulations.visualisations.imageInfo.legalArea}
          value={visualisierung.Digitalcheck?.Regelungsvorhaben?.Rechtsgebiet}
        />
        <LabelValuePair
          label={regulations.visualisations.imageInfo.publishedOn}
          value={formatDate(
            visualisierung.Digitalcheck?.Regelungsvorhaben
              ?.VeroeffentlichungsDatum,
          )}
        />
        <LabelValuePair
          label={regulations.visualisations.imageInfo.type}
          value={visualisierung.Visualisierungsart}
        />
        <LabelValuePair
          label={regulations.visualisations.imageInfo.tool}
          value={visualisierung.Visualisierungstool}
        />
        <LabelValuePair
          label={regulations.visualisations.imageInfo.department}
          value={visualisierung.Digitalcheck?.Regelungsvorhaben?.Ressort}
        />
      </div>
    </div>
    <div className="w-1/2 p-0 mb-12">
      <Heading tagName="h3" look="ds-heading-03-reg" className="mb-16">
        {visualisierung.Titel}
      </Heading>
      <BlocksRenderer content={visualisierung.Beschreibung}></BlocksRenderer>
    </div>
  </div>
);

export default VisualisationItem;
