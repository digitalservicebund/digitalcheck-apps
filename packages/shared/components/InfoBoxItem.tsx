import { twJoin } from "tailwind-merge";
import { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import DetailsSummary, { type DetailsSummaryProps } from "./DetailsSummary";
import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type InfoBoxItemProps = {
  identifier?: string;
  label?: HeadingProps;
  headline?: HeadingProps;
  image?: ImageProps;
  content?: string;
  detailsSummary?: DetailsSummaryProps | DetailsSummaryProps[];
  buttons?: ButtonProps[];
  separator?: boolean;
};

const InfoBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  detailsSummary,
  buttons,
  separator,
}: InfoBoxItemProps) => {
  return (
    <li
      id={identifier}
      className={twJoin(
        "flex flex-row items-center justify-center max-w-none max-[499px]:flex-col scroll-my-40",
        separator &&
          "pb-40 border-solid border-0 border-b-2 border-gray-400 last:border-none",
      )}
    >
      {image && (
        <Image
          {...image}
          {...{
            className:
              "max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px]" +
              " self-baseline",
          }}
        />
      )}
      <div
        className={`ds-stack-16 break-words w-full ${
          image ? "min-[500px]:ml-16" : ""
        }`}
      >
        {label && <Heading {...label} />}
        {headline && <Heading tagName="h3" {...headline} />}
        {content && <RichText markdown={content} />}
        {detailsSummary && !Array.isArray(detailsSummary) && (
          <DetailsSummary {...detailsSummary} />
        )}
        {Array.isArray(detailsSummary) &&
          detailsSummary.map((details) => (
            <DetailsSummary key={details.title} {...details} />
          ))}
        {buttons && buttons.length > 0 && <ButtonContainer buttons={buttons} />}
      </div>
    </li>
  );
};

export default InfoBoxItem;
