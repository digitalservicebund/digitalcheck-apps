import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Link } from "react-router";
import Heading from "~/components/Heading";
import Image from "~/components/Image";
import { regulations } from "~/resources/content";
import { ROUTE_VISUALISATION } from "~/resources/staticRoutes";
import { Visualisierung } from "~/utils/strapiData.server";
import { formatDate } from "~/utils/utilFunctions";

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
    <div className="flex gap-16 max-sm:flex-col sm:gap-24">
      <div className="sm:w-1/2">
        <Link
          to={`${ROUTE_VISUALISATION.url}/${visualisationUrl}`}
          reloadDocument
          target="_blank"
          rel="noreferrer"
          state={{ image: visualisierung.Bild }}
          className="relative block aspect-square cursor-zoom-in overflow-hidden border border-blue-500"
        >
          <Image
            url={visualisierung.Bild.url}
            alternativeText={visualisierung.Bild.alternativeText}
            className="size-full object-cover"
          />
          <ZoomInOutlined
            className="absolute bottom-16 left-16 bg-blue-800 p-1 shadow"
            fill="white"
          />
        </Link>

        <div className="bg-gray-100 p-12">
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
      <div className="mb-12 sm:w-1/2">
        <Heading tagName="h3" look="ds-heading-03-reg" className="mb-16">
          {visualisierung.Titel}
        </Heading>
        <BlocksRenderer content={visualisierung.Beschreibung}></BlocksRenderer>
      </div>
    </div>
  );
}
