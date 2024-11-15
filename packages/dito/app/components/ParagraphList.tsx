import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ReactNode } from "react";
import type {
  Absatz,
  Paragraph,
  Prinzip,
  PrinzipErfuellung,
} from "../utils/strapiData.server.ts";

// Color mapping for different principles
const HIGHLIGHT_COLORS = {
  1: { background: "bg-yellow-300", border: "border-yellow-500" },
  2: { background: "bg-blue-300", border: "border-blue-500" },
  3: { background: "bg-red-300", border: "border-red-500" },
  4: { background: "bg-purple-300", border: "border-purple-500" },
  5: { background: "bg-green-300", border: "border-green-500" },
} as const;

type AbsatzGroup = {
  start: number;
  end?: number;
  absaetze: Absatz[];
};

function PrincipleHighlight({ children }: { children: ReactNode }) {
  if (!children || typeof children !== "object" || !("props" in children)) {
    return null;
  }

  const parts = (children.props.children as string).split(/(\[\d\])/g);
  const number = Number(parts[1][1]) as keyof typeof HIGHLIGHT_COLORS;

  return (
    <mark className={HIGHLIGHT_COLORS[number].background}>
      {parts[0]}
      <sup>{`P${number}`}</sup>
    </mark>
  );
}

const PrincipleExplanation = ({
  erfuellung,
}: {
  erfuellung: PrinzipErfuellung;
}) => (
  <div
    className={`border-l-4 ${HIGHLIGHT_COLORS[erfuellung.Prinzip.Nummer].border} pl-4`}
  >
    <Heading
      tagName="h4"
      text={`P${erfuellung.Prinzip.Nummer} – ${erfuellung.Prinzip.Name}`}
      look="ds-label-01-bold"
    />
    <BlocksRenderer content={erfuellung.WarumGut} />
  </div>
);

const AbsatzContent = ({
  absatzGroup,
}: {
  absatzGroup: Absatz | AbsatzGroup;
}) => {
  if ("id" in absatzGroup) {
    return (
      <div>
        <BlocksRenderer
          content={absatzGroup.Text}
          modifiers={{
            underline: PrincipleHighlight,
          }}
        />
        {absatzGroup.PrinzipErfuellungen.length > 0 && (
          <div className="ds-stack-8 mt-8">
            {/* TODO: move to content file */}
            <span className="ds-label-01-bold italic">Warum ist das gut?</span>
            {absatzGroup.PrinzipErfuellungen.sort(
              (a, b) => a.Prinzip.Nummer - b.Prinzip.Nummer,
            ).map((erfuellung) => (
              <PrincipleExplanation
                key={erfuellung.id}
                erfuellung={erfuellung}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const title = absatzGroup.end
    ? `(${absatzGroup.start + 1}) – (${absatzGroup.end})`
    : `(${absatzGroup.start + 1})`;

  return (
    <DetailsSummary
      title={title}
      content={
        <div className="ds-stack-8">
          {absatzGroup.absaetze.map((absatz) => (
            <BlocksRenderer key={absatz.id} content={absatz.Text} />
          ))}
        </div>
      }
    />
  );
};

function Paragraph({
  paragraph,
  principlesToFilter,
}: {
  paragraph: Paragraph;
  principlesToFilter: Prinzip[];
}) {
  // Filter relevant principles
  const principleNumbers = principlesToFilter.map(
    (principle) => principle.Nummer,
  );
  const filteredAbsaetze = paragraph.Absaetze.map((absatz) => ({
    ...absatz,
    PrinzipErfuellungen: absatz.PrinzipErfuellungen.filter((erfuellung) =>
      principleNumbers.includes(erfuellung.Prinzip.Nummer),
    ),
  }));

  // Group consecutive Absaetze without a relevant PrinzipErfuellungen together
  const groupedAbsaetze = filteredAbsaetze.reduce(
    (groups, absatz, index) => {
      // If the Absatz has Erfuellungen, add it as a standalone item
      if (absatz.PrinzipErfuellungen.length) {
        groups.push(absatz);
        return groups;
      }
      const lastGroup = groups[groups.length - 1];
      // Start a new group if:
      // 1. There are no previous groups, or
      // 2. The last item is a single paragraph (has an 'id')
      if (!lastGroup || "id" in lastGroup) {
        groups.push({
          start: index,
          absaetze: [absatz],
        });
        return groups;
      }
      // Add to existing group
      lastGroup.end = index;
      lastGroup.absaetze.push(absatz);
      return groups;
    },
    [] as (Absatz | AbsatzGroup)[],
  );

  return (
    <div key={paragraph.Nummer}>
      <div className="ds-stack-8 rich-text">
        <p className="ds-label-01-bold">
          § {paragraph.Nummer} {paragraph.Gesetz}
        </p>
        <p className="ds-label-01-bold">{paragraph.Titel}</p>
        <div className="border-l-4 border-gray-300 pl-8 ds-stack-16">
          {groupedAbsaetze.map((absatzGroup) => (
            <AbsatzContent
              key={"id" in absatzGroup ? absatzGroup.id : absatzGroup.start}
              absatzGroup={absatzGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ParagraphList({
  paragraphs,
  principlesToFilter,
}: {
  paragraphs: Paragraph[];
  principlesToFilter: Prinzip[];
}) {
  return (
    <div className="ds-stack-32">
      {paragraphs
        .sort((a, b) => a.Nummer.localeCompare(b.Nummer))
        .map((paragraph) => (
          <Paragraph
            key={paragraph.documentId}
            paragraph={paragraph}
            principlesToFilter={principlesToFilter}
          />
        ))}
    </div>
  );
}
