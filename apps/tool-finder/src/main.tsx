import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import MaintenanceModeApp from "./MaintenanceModeApp";
import { enableTracking } from "./services/tracking";
import "./style.css";

const maintenanceMode: boolean =
  import.meta.env.VITE_MAINTENANCE_MODE == "true";

enableTracking();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>{maintenanceMode ? <MaintenanceModeApp /> : <App />}</Router>
  </React.StrictMode>,
);
