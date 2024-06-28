import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Aria } from "@digitalcheck/shared/components/Aria";
import Breadcrumbs from "@digitalcheck/shared/components/Breadcrumbs";
import FeedbackBanner from "@digitalcheck/shared/components/FeedbackBanner";
import Footer from "@digitalcheck/shared/components/Footer";
import ScrollToTop from "@digitalcheck/shared/components/ScrollToTop";
import useStorage from "@digitalcheck/shared/services/useStorage";
import PageHeader from "src/components/PageHeader";

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

export type RoutesProps = {
  url: string;
  title: string;
  parent?: string;
  element: JSX.Element;
}[];

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

  const footerLinks = [
    { url: PATH_IMPRINT, text: "Impressum" },
    { url: PATH_PRIVACY, text: "Datenschutzerklärung" },
    // { url: PATH_COOKIE, text: "Cookie-Einstellungen" },
    { url: PATH_A11Y, text: "Barrierefreiheit" },
    // { url: PATH_OSS, text: "Open Source Code" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PageHeader />
      <Breadcrumbs breadcrumbs={routes} />
      <main className="flex-grow flex flex-col">
        <div className="flex-grow">
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
      <Footer links={footerLinks} />
      <Aria />
    </div>
  );
}

export default App;
