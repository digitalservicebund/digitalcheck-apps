import type { MetaFunction } from "@remix-run/node";
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
      <div className="bg-blue-100 py-48">
        <div className="container ds-stack-16">
          <h1>{landing.title}</h1>
          <p>{landing.subtitle}</p>
        </div>
      </div>
    </main>
  );
}
