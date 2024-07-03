import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { fivePrincipals, landing, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${landing.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: fivePrincipals.title,
            }}
          ></Header>
          <div className="ds-stack-16 mt-64">
            <Heading tagName="h4" text="Inhalt" className="font-bold" />
            <ol>
              {fivePrincipals.principals.map((principal) => (
                <li key={principal.label}>
                  <a
                    href={`#${principal.label.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")}`}
                  >
                    ↓ {principal.label}: {principal.title}
                  </a>
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
          <span
            id={principal.label.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")}
          />
          <Container>
            <InfoBox
              heading={{
                tagName: "h2",
                text: principal.title,
              }}
              label={{
                tagName: "h4",
                text: principal.label,
                className: "ds-label-section text-gray-900",
              }}
              items={[{ content: principal.content }]}
            />
          </Container>
        </Background>
      ))}
      <FeedbackBanner />
    </>
  );
}
