import { describe, expect, it } from "vitest";
import { getTocTree } from "./toc";

function render(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root;
}

describe("getTocTree", () => {
  it("nests headings by level and generates missing ids", () => {
    const root = render(`
      <h2>Größe prüfen</h2>
      <h3>Details</h3>
      <h2 id="custom">Zweiter Abschnitt</h2>
    `);

    expect(getTocTree(root)).toEqual([
      {
        id: "groesse-pruefen",
        label: "Größe prüfen",
        children: [{ id: "details", label: "Details", children: [] }],
      },
      { id: "custom", label: "Zweiter Abschnitt", children: [] },
    ]);
  });

  it("uses data-toc-label and skips ignored headings", () => {
    const root = render(`
      <h2 id="a1" data-toc-label="A1">Ein langer Titel</h2>
      <h3 data-toc-ignore>Ignoriert</h3>
      <div class="kern-card"><h3>In einer Karte</h3></div>
    `);

    expect(getTocTree(root)).toEqual([{ id: "a1", label: "A1", children: [] }]);
  });
});
