import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ReactNode } from "react";
import { digitalSuitability } from "../resources/content.ts";
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

function PrincipleHighlight(
  { children }: { children: ReactNode },
  principlesToShow: number[],
) {
  if (!children || typeof children !== "object" || !("props" in children)) {
    return null;
  }

  const parts = (children.props.children as string).split(/(\[\d\])/g);
  const number = Number(parts[1][1]) as keyof typeof HIGHLIGHT_COLORS;

  return principlesToShow.includes(number) ? (
    <mark className={HIGHLIGHT_COLORS[number].background}>
      {parts[0]}
      <sup>{`P${number}`}</sup>
    </mark>
  ) : (
    parts[0]
  );
}

const PrincipleExplanation = ({
  erfuellung,
}: {
  erfuellung: PrinzipErfuellung;
}) =>
  erfuellung.Prinzip && (
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

type AbsatzWithNumber = Absatz & { number: number };
type Node = { type: string; text?: string; children?: Node[] };

const isStandaloneAbsatz = (
  absatz: AbsatzWithNumber | AbsatzWithNumber[],
): absatz is AbsatzWithNumber => "id" in absatz;

const AbsatzContent = ({
  absatzGroup,
  principlesToShow,
}: {
  absatzGroup: AbsatzWithNumber | AbsatzWithNumber[];
  principlesToShow: number[];
}) => {
  // Add Absatz number to text by traversing down the content tree to find the first text node and prepending the number
  const prependNumberRecursive = (node: Node, number: number): Node => {
    if (node.type === "text" && node.text) {
      return {
        ...node,
        text: `(${number}) ${node.text}`,
      };
    }

    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: [
          prependNumberRecursive(node.children[0], number),
          ...node.children.slice(1),
        ],
      };
    }

    return node;
  };

  const prependNumberToAbsatz = (absatz: AbsatzWithNumber) => {
    return [
      prependNumberRecursive(
        absatz.Text[0],
        absatz.number,
      ) as BlocksContent[number],
      ...absatz.Text.slice(1),
    ];
  };

  // Render standalone Absatz
  if (isStandaloneAbsatz(absatzGroup)) {
    return (
      <div>
        <BlocksRenderer
          content={prependNumberToAbsatz(absatzGroup)}
          modifiers={{
            underline: ({ children }) =>
              PrincipleHighlight({ children }, principlesToShow),
          }}
        />
        {absatzGroup.PrinzipErfuellungen.length > 0 && (
          <div className="ds-stack-8 mt-8">
            <span className="ds-label-01-bold italic">
              {digitalSuitability.paragraphs.explanation}
            </span>
            {absatzGroup.PrinzipErfuellungen.toSorted(
              (a, b) => (a.Prinzip?.Nummer ?? 0) - (b.Prinzip?.Nummer ?? 0),
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

  const title =
    absatzGroup.length > 1
      ? `(${absatzGroup[0].number}) – (${absatzGroup[absatzGroup.length - 1].number})`
      : `(${absatzGroup[0].number})`;

  return (
    <DetailsSummary
      title={title}
      content={
        <div className="ds-stack-8">
          {absatzGroup.map((absatz) => (
            <BlocksRenderer
              key={absatz.id}
              content={prependNumberToAbsatz(absatz)}
              modifiers={{
                underline: ({ children }) =>
                  PrincipleHighlight({ children }, []), // Do not highlight principles in grouped Absaetze
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
      <div className="ds-stack-8 rich-text">
        <p className="ds-label-01-bold">
          § {paragraph.Nummer} {paragraph.Gesetz}
        </p>
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
        .toSorted((a, b) => a.Nummer.localeCompare(b.Nummer))
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
