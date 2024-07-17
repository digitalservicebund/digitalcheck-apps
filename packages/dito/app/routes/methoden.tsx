import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import { ListItemProps } from "@digitalcheck/shared/components/ListItem";
import ContactSupportOutlined from "@digitalservicebund/icons/ContactSupportOutlined";
import GroupOutlined from "@digitalservicebund/icons/GroupOutlined";
import TimerOutlined from "@digitalservicebund/icons/TimerOutlined";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { renderToString } from "react-dom/server";
import { methods, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${methods.title} — ${siteMeta.title}` }];
};

export default function Index() {
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

  const methodStepsItems = methods.steps.items.map((item: ListItemProps) => {
    // Modify HTML to be able to style icons
    item.content = item.content?.replaceAll("**Zeit:**", timerOutlined);
    item.content = item.content?.replaceAll("**Kollaborativ:**", groupOutlined);
    item.content = item.content?.replaceAll(
      "**Support:**",
      contactSupportOutlined,
    );
    item.headline = {
      ...item.headline,
      tagName: "h3",
      look: item.background ? undefined : "ds-heading-03-bold",
    };

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
              className: "md:text-2xl",
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
