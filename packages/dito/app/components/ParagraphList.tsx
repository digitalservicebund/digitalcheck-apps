import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import ArrowUpwardOutlined from "@digitalservicebund/icons/ArrowUpwardOutlined";
import { Link, useLocation } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ReactNode, useState } from "react";
import { digitalSuitability } from "resources/content.ts";
import { twJoin } from "tailwind-merge";
import {
  AbsatzWithNumber,
  isStandaloneAbsatz,
  nestListInListItems,
  prependNumberToAbsatz,
} from "utils/blocksContentUtils.ts";
import type {
  Paragraph,
  Prinzip,
  PrinzipErfuellung,
} from "utils/strapiData.server.ts";
import { cyrb53 } from "utils/utilFunctions.ts";

// Color mapping for different principles
const HIGHLIGHT_COLORS = {
  1: { background: "bg-yellow-300", border: "border-yellow-500" },
  2: { background: "bg-blue-400", border: "border-blue-500" },
  3: { background: "bg-red-300", border: "border-red-500" },
  4: { background: "bg-orange-200", border: "border-orange-500" },
  5: { background: "bg-green-300", border: "border-green-500" },
} as const;

const explanationID = (baseLabelID: string, number: number) =>
  `${baseLabelID}-${number}`;

const extractTextParts = (children: ReactNode) => {
  if (!children || typeof children !== "object" || !("props" in children)) {
    return null;
  }
  const text = children.props.children as string;
  return text.split(/(\[\d])/g);
};

const RemoveHighlight = ({ children }: { children: ReactNode }) => {
  const parts = extractTextParts(children);
  if (!parts) return null;
  return parts[1] ? parts[0] : parts.join("");
};

function PrincipleHighlight(
  { children }: { children: ReactNode },
  principlesToShow: number[],
  baseLabelID: string,
  onClick: (id: string, number: number) => void,
) {
  const parts = extractTextParts(children);
  if (!parts) return null;
  if (!parts[1]) return parts[0];

  const number = Number(parts[1][1]) as keyof typeof HIGHLIGHT_COLORS;
  // Create a unique ID for the highlight based on the text content
  const highlightID = `markierung-${cyrb53(parts[0])}`;

  return principlesToShow.includes(number) ? (
    <Link
      id={highlightID}
      replace
      to={`#${explanationID(baseLabelID, number)}`}
      onClick={() => onClick(highlightID, number)}
      aria-label={`Erfüllt Prinzip ${number}: ${parts[0]}`}
      className="!no-underline"
    >
      <mark className={`ds-body-01-reg ${HIGHLIGHT_COLORS[number].background}`}>
        {parts[0]}
        <sup>{`P${number}`}</sup>
      </mark>
    </Link>
  ) : (
    parts[0]
  );
}

const PrincipleExplanation = ({
  erfuellung,
  id,
  highlightID,
  onClickBackLink,
}: {
  erfuellung: PrinzipErfuellung;
  id: string;
  highlightID: string | null;
  onClickBackLink: () => void;
}) => {
  const location = useLocation();

  if (!erfuellung.Prinzip) {
    return null;
  }

  // Unfortunately, the straightforward target modifier doesn't work here due to the client side navigation: https://github.com/remix-run/remix/issues/6432
  // Using the hash leads to a hydration mismatch due to the location hash only being available on the client
  const shouldHighlight = location.hash === `#${id}`;
  const color = HIGHLIGHT_COLORS[erfuellung.Prinzip.Nummer];
  const explanationClasses = twJoin(
    "p-4 w-fit max-w-[642px]",
    color.border,
    shouldHighlight ? "border-4" : "border-l-4 py-8",
  );

  return (
    <div className={explanationClasses} id={id} data-testid={id}>
      <div className="flex gap-4 content-center">
        <Heading
          tagName="h4"
          text={`Prinzip ${erfuellung.Prinzip.Nummer} – ${erfuellung.Prinzip.Name}`}
          look="ds-label-01-bold"
        />
        {highlightID && (
          <Link
            replace
            to={`#${highlightID}`}
            className="ds-link-01-bold"
            aria-label="Zurück zum Text"
            onClick={onClickBackLink}
          >
            <ArrowUpwardOutlined className="fill-blue-800" />
          </Link>
        )}
      </div>
      <BlocksRenderer content={erfuellung.WarumGut} />
    </div>
  );
};

const AbsatzContent = ({
  absatzGroup,
  principlesToShow,
}: {
  absatzGroup: AbsatzWithNumber | AbsatzWithNumber[];
  principlesToShow: number[];
}) => {
  // This ID is used to track which highlight was clicked on to provide a back link
  const [clickedHighlightID, setClickedHighlightID] = useState<string | null>(
    null,
  );
  const [clickedHighlightPrinciple, setClickedHighlightPrinciple] = useState<
    number | null
  >(null);
  const onClickHighlight = (id: string, principleNumber: number) => {
    setClickedHighlightID(id);
    setClickedHighlightPrinciple(principleNumber);
  };
  const onClickBackLink = () => {
    setClickedHighlightID(null);
    setClickedHighlightPrinciple(null);
  };

  // Render standalone Absatz with PrinzipErfuellungen
  if (isStandaloneAbsatz(absatzGroup)) {
    // This ID is used to label the reference in the highlight with the general explanation header
    // and also serves as a basis for the link between the highlight and the specific explanation

    const baseLabelID = `warumGut-${absatzGroup.id}`;
    const content = nestListInListItems(prependNumberToAbsatz(absatzGroup));

    return (
      <div className="[&_ol]:list-decimal [&_ol_ol]:list-[lower-alpha]">
        <BlocksRenderer
          content={content}
          modifiers={{
            underline: ({ children }) =>
              PrincipleHighlight(
                { children },
                principlesToShow,
                baseLabelID,
                onClickHighlight,
              ),
          }}
        />
        {absatzGroup.PrinzipErfuellungen.length > 0 && (
          <div className="ds-stack-8 mt-8">
            <span className="ds-label-01-bold italic" id={baseLabelID}>
              {digitalSuitability.paragraphs.explanation}
            </span>
            {absatzGroup.PrinzipErfuellungen.toSorted(
              (a, b) => (a.Prinzip?.Nummer ?? 0) - (b.Prinzip?.Nummer ?? 0),
            ).map(
              (erfuellung) =>
                erfuellung.Prinzip && (
                  <PrincipleExplanation
                    key={erfuellung.id}
                    erfuellung={erfuellung}
                    id={explanationID(baseLabelID, erfuellung.Prinzip.Nummer)}
                    highlightID={
                      clickedHighlightPrinciple === erfuellung.Prinzip.Nummer
                        ? clickedHighlightID
                        : null
                    }
                    onClickBackLink={onClickBackLink}
                  />
                ),
            )}
          </div>
        )}
      </div>
    );
  }

  const title =
    absatzGroup.length > 1
      ? `(${absatzGroup[0].number}) – (${absatzGroup[absatzGroup.length - 1].number})`
      : `(${absatzGroup[0].number})`;

  return (
    <DetailsSummary
      title={title}
      bold={false}
      content={
        <div className="ds-stack-8">
          {absatzGroup.map((absatz) => (
            <BlocksRenderer
              key={absatz.id}
              content={prependNumberToAbsatz(absatz)}
              modifiers={{
                underline: RemoveHighlight,
              }}
            />
          ))}
        </div>
      }
    />
  );
};

function Paragraph({
  paragraph,
  principlesToShow,
}: Readonly<{
  paragraph: Paragraph;
  principlesToShow: Prinzip[];
}>) {
  // Filter relevant principles
  const principleNumbers = principlesToShow.map(
    (principle) => principle.Nummer,
  );
  const filteredAbsaetzeWithNumber = paragraph.Absaetze.map(
    (absatz, index) => ({
      ...absatz,
      number: index + 1,
      PrinzipErfuellungen: absatz.PrinzipErfuellungen.filter(
        (erfuellung) =>
          erfuellung.Prinzip &&
          principleNumbers.includes(erfuellung.Prinzip.Nummer),
      ),
    }),
  );
  // Filter whole paragraphs without relevant PrinzipErfuellungen
  if (
    filteredAbsaetzeWithNumber.every(
      (absatz) => absatz.PrinzipErfuellungen.length === 0,
    )
  ) {
    return null;
  }

  // Group consecutive Absaetze without a relevant PrinzipErfuellungen together
  const groupedAbsaetze = filteredAbsaetzeWithNumber.reduce(
    (groups, absatz) => {
      // If the current Absatz has Erfuellungen, add it as a standalone item
      if (absatz.PrinzipErfuellungen.length) {
        groups.push(absatz);
        return groups;
      }
      const lastGroup = groups[groups.length - 1];
      // Start a new group if:
      // 1. There are no previous groups, or
      // 2. The last item had relevant PrinzipErfuellungen (thus is a standalone Absatz with an 'id')
      if (!lastGroup || isStandaloneAbsatz(lastGroup)) {
        groups.push([absatz]);
        return groups;
      }
      // Add to existing group
      lastGroup.push(absatz);
      return groups;
    },
    [] as (AbsatzWithNumber | AbsatzWithNumber[])[],
  );

  return (
    <div key={paragraph.Nummer}>
      <div className="ds-stack-8">
        <Heading
          tagName="h3"
          text={`§ ${paragraph.Nummer} ${paragraph.Gesetz}`}
          look="ds-label-01-bold"
        />
        <p className="ds-label-01-bold">{paragraph.Titel}</p>
        <div className="border-l-4 border-gray-300 pl-8 ds-stack-16">
          {groupedAbsaetze.map((absatzGroup) => (
            <AbsatzContent
              key={"id" in absatzGroup ? absatzGroup.id : absatzGroup[0].number}
              absatzGroup={absatzGroup}
              principlesToShow={principleNumbers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ParagraphList({
  paragraphs,
  principlesToShow,
}: Readonly<{
  paragraphs: Paragraph[];
  principlesToShow: Prinzip[];
}>) {
  return (
    <div className="ds-stack-32">
      {paragraphs
        .toSorted((a, b) =>
          a.Nummer.localeCompare(b.Nummer, "de-DE", { numeric: true }),
        )
        .map((paragraph) => (
          <Paragraph
            key={paragraph.documentId}
            paragraph={paragraph}
            principlesToShow={principlesToShow}
          />
        ))}
    </div>
  );
}
