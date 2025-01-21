import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { BulletList, NumberedList } from "@digitalcheck/shared/components/List";
import { ListItemProps } from "@digitalcheck/shared/components/ListItem";
import { type MetaFunction } from "@remix-run/react";
import FeedbackForm from "components/FeedbackForm";
import SupportBanner from "components/SupportBanner";
import { renderToString } from "react-dom/server";
import { methods } from "resources/content";
import { ROUTE_METHODS } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_METHODS.title, matches);
};

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

export default function Methoden() {
  const renderInfoItem = (info: InfoItem) => (
    <span key={info.text} className="mb-8 flex gap-4 last:mb-24">
      <info.icon className="mt-6 size-16" />
      <span>{info.text}</span>
    </span>
  );

  const methodStepsItems: ListItemProps[] = methods.steps.items.map((item) => ({
    ...item,
    background: item.isSubstep ? "blue" : undefined,
    content: renderToString(
      <>
        {item.info?.map((info) => renderInfoItem(info))}
        {item.text}
      </>,
    ),
    headline: {
      ...item.headline,
      tagName: item.isSubstep ? "h3" : "h2",
      look: item.isSubstep ? "ds-heading-03-reg" : "ds-heading-02-bold",
    },
  }));

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
      <FeedbackForm />
      <SupportBanner withFeedbackBanner={false} />
    </>
  );
}
