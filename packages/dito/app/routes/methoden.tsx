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
  const { methodSubpagesEnabled } = useLoaderData<typeof loader>();
  const methodStepsItems = methods.steps.items.map((item) => {
    // FEATURE FLAG: Disable subpages in production, as they aren't complete yet
    if (!methodSubpagesEnabled) {
      item.buttons = [];
    }

    // Modify HTML to be able to style icons
    item.content = item.content.replaceAll(
      "**Zeit:**",
      `<strong data-icon="TimerOutlined">Zeit:</strong>`,
    );
    item.content = item.content.replaceAll(
      "**Kollaborativ:**",
      `<strong data-icon="GroupOutlined">Kollaborativ:</strong>`,
    );
    item.content = item.content.replaceAll(
      "**Support:**",
      `<strong data-icon="ContactSupportOutlined">Support:</strong>`,
    );

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
