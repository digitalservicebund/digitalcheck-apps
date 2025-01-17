import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { Link } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations } from "resources/content";
import { ROUTE_VISUALISATION } from "resources/staticRoutes";
import { Visualisierung } from "utils/strapiData.server";
import { formatDate } from "utils/utilFunctions";

const LabelValuePair = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="space-x-8">
      <span>{label}</span>
      <span className="ds-label-01-bold">{value}</span>
    </div>
  ) : null;

export default function VisualisationItem({
  visualisierung,
}: Readonly<{
  visualisierung: Visualisierung;
}>) {
  const visualisationUrl = visualisierung.Bild.url.split("/").pop();

  return (
    <div className="flex max-sm:flex-col gap-16 sm:gap-32">
      <div className="sm:w-1/2">
        <Link
          to={`${ROUTE_VISUALISATION.url}/${visualisationUrl}`}
          reloadDocument
          target="_blank"
          rel="noreferrer"
          state={{ image: visualisierung.Bild }}
          className="block relative border border-blue-500 aspect-square overflow-hidden cursor-zoom-in"
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
        </Link>

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
      <div className="sm:w-1/2 mb-12">
        <Heading tagName="h3" look="ds-heading-03-reg" className="mb-16">
          {visualisierung.Titel}
        </Heading>
        <BlocksRenderer content={visualisierung.Beschreibung}></BlocksRenderer>
      </div>
    </div>
  );
}
