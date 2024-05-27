import TrackingContext from "@digitalcheck/shared/contexts/trackingContext.ts";
import App from "App.tsx";
import MaintenanceModeApp from "MaintenanceModeApp";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "style.css";
import tracking from "./services/tracking.tsx";

const maintenanceMode: boolean =
  import.meta.env.VITE_MAINTENANCE_MODE == "true";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TrackingContext.Provider value={tracking}>
      <Router>{maintenanceMode ? <MaintenanceModeApp /> : <App />}</Router>
    </TrackingContext.Provider>
  </React.StrictMode>,
);
