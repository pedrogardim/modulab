import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import { SessionProvider } from "@/context/SessionContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </Provider>
  </React.StrictMode>
);
