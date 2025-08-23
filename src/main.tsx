import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { HomePage } from "./pages/Home";
import { AppProvider } from "./provider/AppProvider";
// import { TestPage } from './pages/Test'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <HomePage />
      {/* <TestPage/> */}
    </AppProvider>
  </StrictMode>
);
