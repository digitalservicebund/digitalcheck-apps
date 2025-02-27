import { describe, expect, it } from "vitest";
import {
  AbsatzWithNumber,
  nestListInListItems,
  prependNumberToAbsatz,
} from "~/utils/blocksContentUtils";

describe("prependNumberToAbsatz", () => {
  it("should prepend number to first text node in absatz", () => {
    const textNode1 = { type: "text" as const, text: "TEXT1" };
    const textNode2 = { type: "text" as const, text: "TEXT2" };
    const absatz: AbsatzWithNumber = {
      id: 1,
      number: 42,
      Text: [
        {
          type: "paragraph",
          children: [textNode1, textNode2],
        },
        {
          type: "paragraph",
          children: [textNode1, textNode2],
        },
      ],
      PrinzipErfuellungen: [],
    };

    const result = prependNumberToAbsatz(absatz);
    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "text", text: "(42) TEXT1" },
          { type: "text", text: "TEXT2" },
        ],
      },
      {
        type: "paragraph",
        children: [
          { type: "text", text: "TEXT1" },
          { type: "text", text: "TEXT2" },
        ],
      },
    ]);
  });
});

describe("nestListInListItems", () => {
  it("should nest lists within list items correctly", () => {
    const textNode = { type: "text", text: "TEXT" };
    const input = [
      {
        type: "paragraph",
        children: [textNode],
      },
      {
        type: "list",
        format: "ordered",
        children: [
          {
            type: "list-item",
            children: [textNode],
          },
          {
            type: "list",
            format: "ordered",
            children: [
              {
                type: "list-item",
                children: [textNode],
              },
            ],
          },
          {
            type: "list-item",
            children: [textNode],
          },
          {
            type: "list",
            format: "ordered",
            children: [
              {
                type: "list-item",
                children: [textNode],
              },
            ],
          },
        ],
      },
    ];

    const expected = [
      {
        type: "paragraph",
        children: [textNode],
      },
      {
        type: "list",
        format: "ordered",
        children: [
          {
            type: "list-item",
            children: [
              textNode,
              {
                type: "list",
                format: "ordered",
                children: [
                  {
                    type: "list-item",
                    children: [textNode],
                  },
                ],
              },
            ],
          },
          {
            type: "list-item",
            children: [
              textNode,
              {
                type: "list",
                format: "ordered",
                children: [
                  {
                    type: "list-item",
                    children: [textNode],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = nestListInListItems(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty input array", () => {
    expect(nestListInListItems([])).toEqual([]);
  });

  it("should handle input with no nested lists", () => {
    const textNode = { type: "text", text: "TEXT" };
    const input = [
      {
        type: "paragraph",
        children: [textNode],
      },
      {
        type: "list",
        format: "ordered",
        children: [
          {
            type: "list-item",
            children: [textNode],
          },
          {
            type: "list-item",
            children: [textNode],
          },
        ],
      },
    ];

    const result = nestListInListItems(input);
    expect(result).toEqual(input);
  });
});
