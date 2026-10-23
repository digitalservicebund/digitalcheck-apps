import { compileFlowConfig } from "form-graph-engine";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { createWizardStore } from "./createWizardStore";

const fields = { first: z.enum(["a", "b"]), second: z.string().min(1) };

const flow = compileFlowConfig({
  pages: {
    first: { path: "/test/first", pageSchema: { first: fields.first } },
    second: { path: "/test/second", pageSchema: { second: fields.second } },
    end: { path: "/test/end" },
  },
  transitions: {
    first: [{ guard: (data) => data.first === "a", target: "second" }],
    second: "end",
    end: null,
  },
  initialStep: "first",
});

const STORAGE_KEY = "testWizard";

const createStore = (path = "/test/first") => {
  const store = createWizardStore(STORAGE_KEY, flow, fields);
  store.$path.set(path);
  return store;
};

describe("createWizardStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists saved data in localStorage", () => {
    const { save, $data } = createStore();

    save({ first: "a" });
    save({ second: "text" });

    expect($data.get()).toEqual({ first: "a", second: "text" });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      first: "a",
      second: "text",
    });
  });

  it("reads stored data on creation", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ first: "b" }));

    expect(createStore().$data.get()).toEqual({ first: "b" });
  });

  it("drops unknown fields and invalid values from storage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ first: "invalid", second: "ok", unknown: "x" }),
    );

    expect(createStore().$data.get()).toEqual({ second: "ok" });
  });

  it("falls back to empty data for unparsable storage", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");

    expect(createStore().$data.get()).toEqual({});
  });

  it("evaluates the session with the saved data", () => {
    const { save, $session } = createStore();

    expect($session.get()?.nextPath()).toBeUndefined();
    save({ first: "a" });
    expect($session.get()?.nextPath()).toBe("/test/second");
  });

  it("notifies subscribers about session changes", () => {
    const { save, $session } = createStore("/test/second");
    const prevPaths: (string | undefined)[] = [];
    const unsubscribe = $session.subscribe((session) =>
      prevPaths.push(session?.prevPath),
    );

    save({ first: "a" });
    unsubscribe();

    // "/test/second" is only reachable once "first" is answered with "a"
    expect(prevPaths).toEqual([undefined, "/test/first"]);
  });

  it("has no session outside of the flow", () => {
    expect(createStore("/other").$session.get()).toBeUndefined();
  });

  it("ignores a trailing slash in the path", () => {
    expect(createStore("/test/first/").$session.get()?.nodeKey).toBe("first");
  });

  it("resets the data", () => {
    const { save, reset, $data } = createStore();
    save({ first: "a" });

    reset();

    expect($data.get()).toEqual({});
  });

  it("knows whether answers are stored", () => {
    const { save, reset, $hasAnswers } = createStore();
    expect($hasAnswers.get()).toBe(false);

    save({ first: "a" });
    expect($hasAnswers.get()).toBe(true);

    reset();
    expect($hasAnswers.get()).toBe(false);
  });

  it("has no answers when storage only holds invalid values", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unknown: "x" }));

    expect(createStore().$hasAnswers.get()).toBe(false);
  });

  it("resumes at the first unanswered question", () => {
    const { save, reset, $resumePath } = createStore();
    expect($resumePath.get()).toBe("/test/first");

    save({ first: "a" });
    expect($resumePath.get()).toBe("/test/second");

    save({ second: "text" });
    expect($resumePath.get()).toBe("/test/end");

    reset();
    save({ second: "text" });
    expect($resumePath.get()).toBe("/test/first");
  });

  it("knows which pages are reachable, also outside the flow", () => {
    const { save, $isReachable } = createStore("/elsewhere");
    expect($isReachable.get()("/test/first")).toBe(true);
    expect($isReachable.get()("/test/second")).toBe(false);

    save({ first: "a" });
    expect($isReachable.get()("/test/second")).toBe(true);
    expect($isReachable.get()("/test/end")).toBe(true);
  });
});
