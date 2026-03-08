import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/loader.css";

import "./i18n/i18n";
import { LoadingProvider } from "./context/LoadingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </BrowserRouter>,
);
