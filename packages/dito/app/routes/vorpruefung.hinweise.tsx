import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import RichText from "@digitalcheck/shared/components/RichText";
import { type MetaFunction } from "@remix-run/react";
import { preCheck } from "resources/content";
import { ROUTE_GENERAL_INFO, ROUTE_PRECHECK } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

const { questions, generalInfo } = preCheck;
const { headline, text, nextButton, hint } = generalInfo;

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_GENERAL_INFO.title, matches);
};

export default function GeneralInfo() {
  return (
    <div className="flex bg-blue-100 sm:pt-32 parent-bg-blue">
      <section>
        <Container className="pt-0">
          <Heading
            text={headline}
            tagName="h1"
            look="ds-heading-02-reg"
            className="mb-16"
          />
          <RichText markdown={text} className="mb-40" />
          <InlineNotice
            look="tips"
            title={hint.title}
            tagName="h2"
            content={hint.text}
          />
          <ButtonContainer
            buttons={[
              {
                id: "generalInfo-next-button",
                text: nextButton,
                href: questions[0].url,
              },
              {
                id: "generalInfo-back-button",
                text: "Zurück",
                href: ROUTE_PRECHECK.url,
                look: "tertiary",
              },
            ]}
            className="pt-40"
          />
        </Container>
      </section>
    </div>
  );
}
