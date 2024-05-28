import type { MetaFunction } from "@remix-run/node";
import { landing } from "resources/content";

export const meta: MetaFunction = () => {
  return [
    { title: "Dito" },
    { name: "description", content: "Hello DigitalService!" },
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
