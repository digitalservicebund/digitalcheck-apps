import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { BulletList, NumberedList } from "@digitalcheck/shared/components/List";
import { ListItemProps } from "@digitalcheck/shared/components/ListItem";
import RichText from "@digitalcheck/shared/components/RichText";
import ContactSupportOutlined from "@digitalservicebund/icons/ContactSupportOutlined";
import GroupOutlined from "@digitalservicebund/icons/GroupOutlined";
import TimerOutlined from "@digitalservicebund/icons/TimerOutlined";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { renderToString } from "react-dom/server";
import { header, methods } from "resources/content";
import { ROUTE_METHODS } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";
import { iconClassName } from "../utils/iconStyle.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_METHODS.title, matches);
};

export default function Index() {
  // This messy code is a hacky solution to inject icons into the content, while preserving the ability to modify content easily via Markdown
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
      tagName: "h2",
      look: item.background ? "ds-heading-03-reg" : "ds-heading-03-bold",
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
      <Background backgroundColor="yellow">
        <Container paddingTop="10" paddingBottom="10">
          <RichText markdown={header.underConstruction}></RichText>
        </Container>
      </Background>
      <Container>
        <BulletList items={methodStepsItems} />
      </Container>
      <div id={"weiter"} />
      <Container>
        <NumberedList
          heading={{
            tagName: "h2",
            text: methods.nextSteps.title,
          }}
          items={methods.nextSteps.items}
        />
      </Container>
      <FeedbackBanner />
    </>
  );
}
