import { screen } from "@testing-library/dom";

describe("App", () => {
  test("shows hello message", () => {
    document.body.innerHTML = `
      <h1>Hello DigitalService<h1>
    `;

    return expect(screen.getByText("Hello DigitalService")).toBeVisible();
  });
});
