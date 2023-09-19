import "./App.css";

import { useState, useEffect } from "react";

import { Switch, Route, withRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@material-ui/core";

import * as Tone from "tone";

import Workspace from "./components/ui/Workspace";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (!unsavedChanges) return;
      var dialogText = "Dialog text here";
      e.returnValue = dialogText;
      return dialogText;
    };
  }, [unsavedChanges]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app-wrapper" onMouseDown={() => Tone.start()}>
        <Switch>
          <Route exact path="/">
            <Workspace />
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default withRouter(App);
