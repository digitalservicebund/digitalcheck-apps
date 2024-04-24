import { screen } from "@testing-library/dom";

describe("App", () => {
  it("shows hello message", () => {
    document.body.innerHTML = `
      <h1>Hello DigitalService<h1>
    `;
    expect(screen.getByText("Hello DigitalService")).toBeVisible();
  });
});
