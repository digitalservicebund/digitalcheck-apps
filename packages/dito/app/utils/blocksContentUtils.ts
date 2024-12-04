import { BlocksContent } from "@strapi/blocks-react-renderer";
import { Absatz } from "./strapiData.server";

export type AbsatzWithNumber = Absatz & { number: number };
type Node = { type: string; text?: string; children?: Node[] };

export function isStandaloneAbsatz(
  absatz: AbsatzWithNumber | AbsatzWithNumber[],
): absatz is AbsatzWithNumber {
  return "id" in absatz;
}

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

export function prependNumberToAbsatz(absatz: AbsatzWithNumber) {
  return [
    prependNumberRecursive(
      absatz.Text[0],
      absatz.number,
    ) as BlocksContent[number],
    ...absatz.Text.slice(1),
  ];
}

/**
 * Ensures that sub-list nodes are nested under their preceding list-item nodes.
 *
 * Example transformation:
 * Input:
 * [
 *   { type: "list", children: [
 *     { type: "list-item", children: [...] },
 *     { type: "list", children: [...] },
 *     { type: "list-item", children: [...] }
 *   ]},
 *   ...
 * ]
 *
 * Output:
 * [
 *   { type: "list", children: [
 *     {
 *       type: "list-item",
 *       children: [
 *         ...,
 *         { type: "list", children: [...] },
 *       ]
 *     },
 *     { type: "list-item", children: [...] }
 *   ]},
 *   ...
 * ]
 */
export function nestListInListItems(nodes: Node[]): BlocksContent {
  const result: Node[] = [];
  let currentListItem: Node | null = null;

  nodes.forEach((node) => {
    const processedNode = {
      ...node,
      children: node.children ? nestListInListItems(node.children) : undefined,
    };

    if (
      processedNode.type === "list" &&
      currentListItem?.type === "list-item"
    ) {
      // Nest list under previous list item
      currentListItem.children = currentListItem.children || [];
      currentListItem.children.push(processedNode);
      currentListItem = null;
    } else {
      result.push(processedNode);
      currentListItem =
        processedNode.type === "list-item" ? processedNode : null;
    }
  });

  return result as BlocksContent;
}
