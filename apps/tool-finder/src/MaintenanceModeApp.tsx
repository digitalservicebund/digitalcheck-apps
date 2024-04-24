import { Link, Route, Routes } from "react-router-dom";
import Container from "./components/Container";
import PageHeader from "./components/PageHeader";
import { PATH_IMPRINT, PATH_INFO } from "./routes";
import Imprint from "./routes/Imprint";
import MaintenanceModePage from "./routes/MaintenanceModePage";

function MaintenanceModeApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className={"flex-grow flex flex-col"}>
        <PageHeader />
        <Routes>
          <Route path={PATH_INFO} element={<MaintenanceModePage />} />
          <Route path={PATH_IMPRINT} element={<Imprint />} />
        </Routes>
      </main>
      <footer>
        <Container paddingTop="48" paddingBottom="48">
          <Link to={PATH_IMPRINT} className="text-link increase-tap-area">
            Impressum
          </Link>
        </Container>
      </footer>
    </div>
  );
}

export default MaintenanceModeApp;
