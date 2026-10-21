import { preCheck } from "@/resources/content/vorpruefung";
import { createFlowSession } from "form-graph-engine";
import { vorpruefungFlow } from "./vorpruefungFlow";
import { vorpruefungFields } from "./vorpruefungSchema";

const questionPaths = preCheck.questions.map((question) => question.path);
const allYes = Object.fromEntries(
  preCheck.questions.map((question) => [question.id, "yes"]),
);

describe("vorpruefungFlow", () => {
  it("matches the question order from the content, followed by the result page", () => {
    const session = createFlowSession(vorpruefungFlow, allYes);

    expect(session.path).toEqual([...questionPaths, "/vorpruefung/ergebnis"]);
    expect(session.isComplete).toBe(true);
  });

  it("makes the result page reachable once all questions are answered", () => {
    const session = createFlowSession(vorpruefungFlow, allYes);

    expect(session.isReachable("/vorpruefung/ergebnis")).toBe(true);
  });

  it.each(preCheck.questions.map((question) => question.id))(
    "blocks the result page while %s is unanswered",
    (questionId) => {
      const { [questionId]: _, ...answers } = allYes;
      const session = createFlowSession(vorpruefungFlow, answers);

      expect(session.isReachable("/vorpruefung/ergebnis")).toBe(false);
      expect(session.isComplete).toBe(false);
    },
  );

  it("leads from the last question to the result page with the new answer", () => {
    const { "eu-bezug": _, ...answers } = allYes;
    const session = createFlowSession(
      vorpruefungFlow,
      answers,
      "/vorpruefung/eu-bezug",
    );

    expect(session.nextPath()).toBeUndefined();
    expect(session.nextPath({ "eu-bezug": "no" })).toBe(
      "/vorpruefung/ergebnis",
    );
  });

  it("starts with the first question", () => {
    const session = createFlowSession(vorpruefungFlow, {});

    expect(session.initialPath).toBe("/vorpruefung/it-system");
    expect(session.prevPath).toBeUndefined();
  });

  it("navigates to the next and previous question", () => {
    const session = createFlowSession(
      vorpruefungFlow,
      { "it-system": "yes" },
      "/vorpruefung/verpflichtungen-fuer-beteiligte",
    );

    expect(session.nextPath()).toBe("/vorpruefung/datenaustausch");
    expect(session.prevPath).toBe("/vorpruefung/it-system");
  });

  it("points to the first unanswered question", () => {
    const session = createFlowSession(vorpruefungFlow, {
      "it-system": "no",
      "verpflichtungen-fuer-beteiligte": "unsure",
    });

    expect(session.nextIncomplete()).toBe("/vorpruefung/datenaustausch");
  });

  it("only uses fields from vorpruefungFields, with their schemas", () => {
    for (const path of questionPaths) {
      const pageSchema = vorpruefungFlow.getSchema(path);
      expect(pageSchema).toBeDefined();
      for (const [name, fieldSchema] of Object.entries(pageSchema!.shape)) {
        expect(fieldSchema).toBe(
          vorpruefungFields[name as keyof typeof vorpruefungFields],
        );
      }
    }
  });

  it("has a field for every question of the content", () => {
    expect(Object.keys(vorpruefungFields)).toEqual(
      preCheck.questions.map((question) => question.id),
    );
  });

  it("only accepts the defined answer options", () => {
    const session = createFlowSession(
      vorpruefungFlow,
      {},
      "/vorpruefung/it-system",
    );

    expect(session.pageSchema.safeParse({ "it-system": "yes" }).success).toBe(
      true,
    );
    expect(session.pageSchema.safeParse({ "it-system": "maybe" }).success).toBe(
      false,
    );
  });
});
