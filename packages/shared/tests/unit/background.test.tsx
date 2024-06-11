import { render, screen } from "@testing-library/react";
import Background from "components/Background";

test("Background renders children", async () => {
  render(
    <Background>
      <button>Click</button>
    </Background>,
  );

  const button = await screen.findByRole("button");
  expect(button).toHaveTextContent("Click");
});
