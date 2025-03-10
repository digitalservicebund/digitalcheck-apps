import { renderToString } from "react-dom/server";
import { type MetaArgs } from "react-router";

import Background from "~/components/Background";
import Container from "~/components/Container";
import FeedbackForm from "~/components/FeedbackForm";
import Header from "~/components/Header";
import { BulletList, NumberedList } from "~/components/List";
import { ListItemProps } from "~/components/ListItem";
import SupportBanner from "~/components/SupportBanner";
import { methods } from "~/resources/content";
import { ROUTE_METHODS } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_METHODS.title, matches);
};

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

export default function Methoden() {
  const renderInfoItem = (info: InfoItem) => (
    <span key={info.text} className="mb-8 flex gap-4 last-of-type:mb-8">
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
        <p>{item.text}</p>
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
      <FeedbackForm {...methods.feedbackForm} />
      <SupportBanner withFeedbackBanner={false} />
    </>
  );
}
