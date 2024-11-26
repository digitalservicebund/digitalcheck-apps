import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { BulletList, NumberedList } from "@digitalcheck/shared/components/List";
import { ListItemProps } from "@digitalcheck/shared/components/ListItem";
import RichText from "@digitalcheck/shared/components/RichText";
import { type MetaFunction } from "@remix-run/react";
import FeedbackForm from "components/FeedbackForm.tsx";
import SupportBanner from "components/SupportBanner";
import { renderToString } from "react-dom/server";
import { header, methods } from "resources/content";
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
    <span key={info.text} className="flex gap-4 items-top mb-8 last:mb-24">
      <info.icon className="h-16 w-16 mt-6" />
      <span>{info.text}</span>
    </span>
  );

  const methodStepsItems: ListItemProps[] = methods.steps.items.map((item) => ({
    ...item,
    content: renderToString(
      <>
        {item.info?.map((info) => renderInfoItem(info))}
        {item.text}
      </>,
    ),
    headline: {
      ...item.headline,
      tagName: "h2",
      look: item.background ? "ds-heading-03-reg" : "ds-heading-03-bold",
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
      <FeedbackForm />
      <SupportBanner withFeedbackBanner={false} />
    </>
  );
}
