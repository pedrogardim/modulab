import ReactDOM from "react-dom";
import "./index.css";
import "./translations/i18n";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Dialog, DialogTitle } from "@material-ui/core";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

const startApp = () => {
  ReactDOM.render(
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>,
    document.getElementById("root")
  );
};

startApp();

reportWebVitals();

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Dialog open={true}>
      <DialogTitle>Ooops.. Something went wrong</DialogTitle>
      <pre>{error.message}</pre>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
      <p>Please, refresh the page</p>
    </Dialog>
  );
}
