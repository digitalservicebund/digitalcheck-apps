import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice.tsx";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { preCheck } from "resources/content";
import { ROUTE_GENERAL_INFO, ROUTE_PRECHECK } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";
import { getAnswersFromCookie } from "../utils/cookies.server.ts";
import PreCheckNavigation from "./vorpruefung.$questionId/PreCheckNavigation.tsx";

const { questions, generalInfo } = preCheck;
const { headline, text, nextButton, hint } = generalInfo;

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_GENERAL_INFO.title, matches);
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  return json({ answers });
}

export default function GeneralInfo() {
  const { answers } = useLoaderData<typeof loader>();
  return (
    <div className="flex bg-blue-100 sm:pt-32 parent-bg-blue">
      <div className="hidden lg:block flex-none pl-32">
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
