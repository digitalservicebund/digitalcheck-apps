import Container from "@digitalcheck/shared/components/Container";
import { Outlet, useRouteLoaderData } from "@remix-run/react";
import { loader as questionLoader } from "routes/vorpruefung.$questionId";
import PreCheckNavigation from "./PreCheckNavigation";

export default function PreCheck() {
  const questionRoute = "routes/vorpruefung.$questionId";
  const { question, answers } =
    useRouteLoaderData<typeof questionLoader>(questionRoute) || {};

  return (
    <div className="flex bg-blue-100">
      <div className="hidden lg:block flex-none pt-48">
        <PreCheckNavigation question={question} answers={answers ?? {}} />
      </div>
      <section>
        <Outlet />
        <Container paddingTop="0" additionalClassNames="lg:hidden">
          <PreCheckNavigation question={question} answers={answers ?? {}} />
        </Container>
      </section>
    </div>
  );
}
