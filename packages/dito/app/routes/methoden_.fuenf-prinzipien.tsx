import Background from "@digitalcheck/shared/components/Background";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import RichText from "@digitalcheck/shared/components/RichText";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { fivePrincipals, siteMeta } from "resources/content";
import { PATH_METHODS } from "resources/staticRoutes";
import { BASE_URL } from "utils/constants.server";

export function loader({ request }: LoaderFunctionArgs) {
  return json({
    referrer: request.headers.get("referer")?.replace(BASE_URL, "") ?? "",
  });
}

export const meta: MetaFunction = () => {
  return [{ title: `${fivePrincipals.title} — ${siteMeta.title}` }];
};

const slugify = (string: string) =>
  string.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

export default function Index() {
  const { referrer } = useLoaderData<typeof loader>();

  const nextStep = referrer.startsWith(PATH_METHODS)
    ? fivePrincipals.nextStepMethods
    : fivePrincipals.nextStep;

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: fivePrincipals.title,
            }}
          />
          <div className="mt-64">
            <Heading tagName="div" text="Inhalt" className="font-bold" />
            <ol className="ds-stack-8 mt-16">
              {fivePrincipals.principals.map((principal) => (
                <li key={principal.label}>
                  <Link
                    to={`#${slugify(principal.label)}`}
                    className="underline underline-offset-4 decoration-1"
                  >
                    ↓ {principal.label}: {principal.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Background>
      {fivePrincipals.principals.map((principal, index) => (
        <Background
          key={principal.content}
          backgroundColor={index % 2 === 0 ? "white" : "blue"}
        >
          <div id={slugify(principal.label)} />
          <Container>
            <InfoBox
              heading={{
                tagName: "h2",
                text: principal.title,
              }}
              label={{
                tagName: "div",
                text: principal.label,
                className: "ds-label-section text-gray-900",
              }}
              items={[{ content: principal.content }]}
            />
          </Container>
        </Background>
      ))}
      <Container>
        <div className="flex flex-col gap-16">
          <Heading
            tagName="div"
            className="ds-label-section text-gray-900"
            text={nextStep.label}
          />
          <Heading tagName="h2" text={nextStep.title} />
          <RichText markdown={nextStep.text} />
          {nextStep.buttons && (
            <ButtonContainer>
              {nextStep.buttons.map((button) => (
                <Button key={button.text ?? button.href} {...button} />
              ))}
            </ButtonContainer>
          )}
        </div>
      </Container>
      <FeedbackBanner />
    </>
  );
}
