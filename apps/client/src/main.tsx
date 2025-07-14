import "./index.css";
import { App } from "./App";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element not found");
}

if (rootElement.innerHTML) {
  throw new Error("root element has innerHTML");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
