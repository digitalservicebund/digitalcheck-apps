import { BlocksContent } from "@strapi/blocks-react-renderer";
import { ReactElement } from "react";

type InternalNode = {
  type: string;
  children: (TextNode | InternalNode)[];
  format?: "unordered" | "ordered";
};
type TextNode = { type: "text"; text: string };

const isInternalNode = (node: InternalNode | TextNode): node is InternalNode =>
  node.type !== "text";

/* Splits a string containing custom <1>...</1> markup into HTML elements.
 * Replaces the tags for the relevant principles with <mark> elements.
 * Returns the rest as <spans>.
 */
const renderTextWithMarks = (
  text: string,
  principlesToFilter: number[],
): ReactElement[] => {
  const parts = text.split(/(<\d>.*?<\/\d>)/g);
  return parts.map((part, index) => {
    const match = part.match(/^<(\d)>(.*?)<\/\1>$/);
    if (match) {
      const num = match[1];
      const content = match[2];
      return principlesToFilter.includes(Number(num)) ? (
        <mark key={index} className="bg-yellow-500">
          {content}
        </mark>
      ) : (
        <span key={index}>{content}</span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

/* Traverses the tree structure of Strapi BlockContent and renders the elements as nodes.
 * Internal nodes have children, for which the renderNode function is called recursively.
 * Leaf nodes are TextNodes, whose string content will be transformed by renderTextWithMarks.
 * Only supports a very limited set of Strapi BlockEditor elements.
 */
// TODO: check nested lists
// TODO: write tests
const renderNode = (
  node: InternalNode | TextNode,
  principlesToFilter: number[],
  index: number,
): ReactElement | ReactElement[] => {
  if (isInternalNode(node)) {
    const children = node.children.map((child, index) =>
      renderNode(child, principlesToFilter, index),
    );
    switch (node.type) {
      case "paragraph":
        return <p key={index}>{children}</p>;
      case "list":
        return node.format === "ordered" ? (
          <ol key={index}>{children}</ol>
        ) : (
          <ul key={index}>{children}</ul>
        );
      case "list-item":
        return <li key={index}>{children}</li>;
      default:
        return <>{children}</>;
    }
  }
  return renderTextWithMarks(node.text, principlesToFilter);
};

export default function AbsatzRenderer({
  text,
  principlesToFilter,
}: {
  text: BlocksContent;
  principlesToFilter: number[];
}) {
  return text.map((block, index) =>
    renderNode(block, principlesToFilter, index),
  );
}
