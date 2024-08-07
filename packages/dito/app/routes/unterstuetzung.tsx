import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Button, { ButtonProps } from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { MetaFunction } from "@remix-run/react";
import InterviewBanner from "components/InterviewBanner";
import { useState } from "react";
import { support } from "resources/content";
import { ROUTE_SUPPORT } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_SUPPORT.title, matches);
};

export default function Index() {
  const [isAppointmentsVisible, setIsAppointmentsVisible] = useState(false);

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: support.title,
            }}
            content={{
              markdown: support.subtitle,
              className: "md:text-2xl",
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <Box
          heading={{ text: support.specificSupport.title }}
          content={{ markdown: support.specificSupport.content }}
        />
        <ButtonContainer className="mt-32">
          <Button
            {...(support.specificSupport.buttons[0] as ButtonProps)}
            onClick={() => {
              setIsAppointmentsVisible(true);
              return false;
            }}
          />
          <Button {...(support.specificSupport.buttons[1] as ButtonProps)} />
        </ButtonContainer>
        <iframe
          src={support.specificSupport.iframe}
          title={support.specificSupport.title}
          aria-label={support.specificSupport.title}
          className={`w-full mt-32 transition-all duration-700 ${isAppointmentsVisible ? "h-[600px]" : "h-0"}`}
        ></iframe>
      </Container>
      <Container>
        <Box
          heading={{ text: support.quickSupport.title }}
          content={{ markdown: support.quickSupport.content }}
        />
      </Container>
      <InterviewBanner />
    </>
  );
}
