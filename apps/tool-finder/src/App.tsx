import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { z } from "zod";

import { Aria } from "@digitalcheck/shared/components/Aria";
import Breadcrumbs, {
  BreadcrumbsProps,
} from "@digitalcheck/shared/components/Breadcrumbs";
import FeedbackBanner from "@digitalcheck/shared/components/FeedbackBanner";
import Footer from "@digitalcheck/shared/components/Footer";
import PageHeader from "@digitalcheck/shared/components/PageHeader";
import ScrollToTop from "@digitalcheck/shared/components/ScrollToTop";
import useStorage from "@digitalcheck/shared/services/useStorage";

import type { Reason } from "src/models/Reason";
import type { Ressort } from "src/models/Ressort";
import type { VisualisationObject } from "src/models/VisualisationObject";
import {
  PATH_A11Y,
  PATH_DECISIONTREE,
  PATH_DIAGRAM,
  PATH_FLOWCHART,
  PATH_IMPRINT,
  PATH_INFO,
  PATH_PRIVACY,
  PATH_QUIZ,
  PATH_RESULT,
} from "src/routes";
import Accessibility from "src/routes/Accessibility";
import DecisionTree from "src/routes/DecisionTree";
import Diagram from "src/routes/Diagram";
import Flowchart from "src/routes/Flowchart";
import Imprint from "src/routes/Imprint";
import InfoPage from "src/routes/InfoPage";
import Privacy from "src/routes/Privacy";
import QuizPage, { QuizPageProps } from "src/routes/QuizPage";
import ResultPage, { ResultPageProps } from "src/routes/ResultPage";

export const RoutesPropsSchema = z.array(
  z.object({
    url: z.string(),
    title: z.string(),
    parent: z.string().optional(),
    element: z.custom<JSX.Element>(),
  }),
);

export type RoutesProps = z.infer<typeof RoutesPropsSchema>;

function getBreadcrumbs(routes: RoutesProps): BreadcrumbsProps {
  return {
    breadcrumbs: routes.map((route) => {
      return { url: route.url, title: route.title, parent: route.parent };
    }),
  };
}

function App() {
  const [ressort, setRessort] = useStorage<Ressort | null>("ressort", null);
  const [object, setObject] = useStorage<VisualisationObject | null>(
    "object",
    null,
  );
  const [reason, setReason] = useStorage<Reason | null>("reason", null);
  const location = useLocation();

  // reset state if user navigates to start page
  useEffect(() => {
    if (location.pathname === PATH_INFO) {
      setRessort(null);
      setObject(null);
      setReason(null);
    }
  }, [location, setRessort, setObject, setReason]);

  const quizProps: QuizPageProps = {
    ressort,
    setRessort,
    object,
    setObject,
    reason,
    setReason,
  };

  const resultProps: ResultPageProps = {
    ressort,
    object,
    reason,
  };

  const routes: RoutesProps = [
    {
      url: PATH_INFO,
      title: "Startseite",
      element: <InfoPage />,
    },
    {
      url: PATH_QUIZ,
      title: "Werkzeugfinder für Visualisierungen",
      element: <QuizPage {...quizProps} />,
      parent: PATH_INFO,
    },
    {
      url: PATH_RESULT,
      title: "Empfohlenes Werkzeug",
      element: <ResultPage {...resultProps} />,
      parent: PATH_QUIZ,
    },
    {
      url: PATH_FLOWCHART,
      title: "Flussdiagramm Anleitung",
      element: <Flowchart />,
      parent: PATH_INFO,
    },
    {
      url: PATH_DIAGRAM,
      title: "Schaubild Anleitung",
      element: <Diagram />,
      parent: PATH_INFO,
    },
    {
      url: PATH_DECISIONTREE,
      title: "Entscheidungsbaum Anleitung",
      element: <DecisionTree />,
      parent: PATH_INFO,
    },
    {
      url: PATH_IMPRINT,
      title: "Impressum",
      element: <Imprint />,
      parent: PATH_INFO,
    },
    {
      url: PATH_A11Y,
      title: "Barrierefreiheit",
      element: <Accessibility />,
      parent: PATH_INFO,
    },
    {
      url: PATH_PRIVACY,
      title: "Datenschutzerklärung",
      element: <Privacy />,
      parent: PATH_INFO,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PageHeader />
      <Breadcrumbs {...getBreadcrumbs(routes)} />
      <main className={"flex-grow flex flex-col"}>
        <div className={"flex-grow"}>
          <Routes>
            {routes.map((route) => {
              return (
                <Route
                  path={route.url}
                  element={route.element}
                  key={route.url}
                />
              );
            })}
          </Routes>
        </div>
        <FeedbackBanner />
      </main>
      <Footer />
      <Aria />
    </div>
  );
}

export default App;
