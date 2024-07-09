import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import { json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { methods, siteMeta } from "resources/content";
import unleash from "utils/feature-flags.server";

export const meta: MetaFunction = () => {
  return [{ title: `${methods.title} — ${siteMeta.title}` }];
};

export const loader = () => {
  const methodSubpagesEnabled = unleash.isEnabled(
    "digitalcheck.method-subpages",
  );

  return json({ methodSubpagesEnabled });
};

export default function Index() {
  // FEATURE FLAG: Disable subpages in production, as they aren't complete yet
  const { methodSubpagesEnabled } = useLoaderData<typeof loader>();
  const methodStepsItems = methodSubpagesEnabled
    ? methods.steps.items
    : methods.steps.items.map((item) => {
        item.buttons = [];
        return item;
      });

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: methods.title,
            }}
            content={{
              markdown: methods.subtitle,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <List items={methodStepsItems} />
        {/* FEATURE FLAG: Revert to this once feature flag is no longer needed */}
        {/* <List items={methods.steps.items} /> */}
      </Container>
      <Container>
        <List
          heading={{
            tagName: "h2",
            text: methods.nextSteps.title,
          }}
          items={methods.nextSteps.items}
          isNumeric
        />
      </Container>
      <FeedbackBanner />
    </>
  );
}
