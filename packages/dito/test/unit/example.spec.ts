import { screen } from "@testing-library/dom";

describe("App", () => {
  it("shows hello message", async () => {
    document.body.innerHTML = `
      <h1>Hello DigitalService<h1>
    `;
    await expect(screen.getByText("Hello DigitalService")).toBeVisible();
  });
});
