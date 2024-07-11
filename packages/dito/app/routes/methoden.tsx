import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import ContactSupportOutlined from "@digitalservicebund/icons/ContactSupportOutlined";
import GroupOutlined from "@digitalservicebund/icons/GroupOutlined";
import TimerOutlined from "@digitalservicebund/icons/TimerOutlined";
import { json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { renderToString } from "react-dom/server";
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

  // This messy code is a hacky solution to inject icons into the content, while preserving the ability to modify content easily via Markdown
  const iconClassName = `
    inline-flex flex-row items-baseline align-baseline gap-4
    [&_svg]:h-16
    [&_svg]:w-16
    [&_svg]:relative
    [&_svg]:-bottom-2
  `;
  const timerOutlined = renderToString(
    <strong className={iconClassName}>
      <TimerOutlined />
      Zeit:
    </strong>,
  );
  const groupOutlined = renderToString(
    <strong className={iconClassName}>
      <GroupOutlined />
      Kollaborativ:
    </strong>,
  );
  const contactSupportOutlined = renderToString(
    <strong className={iconClassName}>
      <ContactSupportOutlined />
      Support:
    </strong>,
  );

  const methodStepsItems = methods.steps.items.map((item) => {
    // FEATURE FLAG: Disable subpages in production, as they aren't complete yet
    if (!methodSubpagesEnabled) {
      item.buttons = [];
    }

    // Modify HTML to be able to style icons
    item.content = item.content.replaceAll("**Zeitaufwand:**", timerOutlined);
    item.content = item.content.replaceAll("**Kollaborativ:**", groupOutlined);
    item.content = item.content.replaceAll(
      "**Support:**",
      contactSupportOutlined,
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
