import Background from "@digitalcheck/shared/components/Background";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { imprint, support } from "resources/content";
import { ROUTE_SUPPORT } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_SUPPORT.title, matches);
};

export default function Index() {
  const [clickedFirstButton, setClickedFirstButton] = useState(false);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const handleFirstButtonClick = () => {
    setClickedFirstButton((prev) => !prev);
    setIsViewVisible((prev) => !prev);
  };

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: support.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={support.content} />
      </Container>
      <Container>
        <ButtonContainer className="mt-48">
          {support.buttons.map((button, index) => (
            <Button
              key={button.text}
              {...button}
              style={
                index == 0 && clickedFirstButton
                  ? { backgroundColor: "green", color: "white" }
                  : {}
              }
              onClickCallback={index === 0 ? handleFirstButtonClick : undefined}
            />
          ))}
        </ButtonContainer>
        {isViewVisible && (
          <Container>
            <iframe
              title="appointments"
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0GW8ANzvdFlSMdYNbkgLe4E44z_hTuKfCqrerj5UVqB15EX5a7Yc0yO4CwI0hkroIluXK0Xp6u?gv=true"
              width="100%"
              height="800"
            ></iframe>
          </Container>
        )}
        <RichText markdown={imprint.content} />
      </Container>
    </>
  );
}
