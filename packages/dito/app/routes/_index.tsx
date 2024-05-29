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

export default function Index() {
  return (
    <main className="">
      <div className="bg-blue-100">
        <div className="container ds-stack-16 pt-64 pb-48">
          <h1>{landing.title}</h1>
          <p className="ds-subhead">{landing.subtitle}</p>
        </div>
      </div>
      <div className="container ds-stack-16 pt-40 pb-48">
        <NumberedList
          title={landing.list.title}
          listItems={landing.list.items}
        />
      </div>
    </main>
  );
}
