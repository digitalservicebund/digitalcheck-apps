import React from "react";
import noopTracking from "../services/noopTracking";

const TrackingContext = React.createContext(noopTracking);

export default TrackingContext;
