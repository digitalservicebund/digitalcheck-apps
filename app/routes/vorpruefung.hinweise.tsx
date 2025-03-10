import { type MetaArgs, useLoaderData } from "react-router";

import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import InlineNotice from "~/components/InlineNotice";
import RichText from "~/components/RichText";
import { general, preCheck } from "~/resources/content";
import { ROUTE_GENERAL_INFO, ROUTE_PRECHECK } from "~/resources/staticRoutes";
import { getAnswersFromCookie } from "~/utils/cookies.server";
import prependMetaTitle from "~/utils/metaTitle";
import type { Route } from "./+types/vorpruefung.hinweise";
import PreCheckNavigation from "./vorpruefung.$questionId/PreCheckNavigation";

const { questions, generalInfo } = preCheck;
const { headline, text, nextButton, hint } = generalInfo;

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_GENERAL_INFO.title, matches);
};

export async function loader({ request }: Route.LoaderArgs) {
  const { answers } = await getAnswersFromCookie(request);
  return { answers };
}

export default function GeneralInfo() {
  const { answers } = useLoaderData<typeof loader>();
  return (
    <div className="parent-bg-blue flex bg-blue-100 sm:pt-32">
      <div className="hidden flex-none pl-32 lg:block">
        <PreCheckNavigation answers={answers ?? {}} />
      </div>
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
                text: general.buttonBack.text,
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
