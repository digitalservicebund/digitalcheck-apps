import RichText from "@digitalcheck/shared/components/RichText";
import type { MetaFunction } from "@remix-run/node";
import NumberedList from "components/NumberedList";
import { landing, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [
    { title: siteMeta.title },
    {
      name: "description",
      content: siteMeta.description,
    },
  ];
};

function Container({ children }: { children: React.ReactNode }) {
  return <div className="container ds-stack-16 pt-40 pb-48">{children}</div>;
}

export default function Index() {
  return (
    <main className="">
      <div className="bg-blue-100">
        <Container>
          <h1>{landing.title}</h1>
          <p className="ds-subhead">{landing.subtitle}</p>
        </Container>
      </div>
      <Container>
        <NumberedList
          title={landing.list.title}
          listItems={landing.list.items}
        />
      </Container>
      <div className="bg-blue-100">
        <Container>
          <h3>{landing.explanation.title}</h3>
          <RichText markdown={landing.explanation.text} />
        </Container>
      </div>
    </main>
  );
}
