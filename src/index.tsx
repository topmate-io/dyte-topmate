import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initRaygun } from "./telemetry/raygun";

// Initialize Raygun error reporting before rendering
initRaygun();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
