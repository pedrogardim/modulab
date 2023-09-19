import "./App.css";

import { useState, useEffect } from "react";

import { Switch, Route, withRouter } from "react-router-dom";

import * as Tone from "tone";

import Workspace from "./components/ui/Workspace";

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
    <div className="app-wrapper" onMouseDown={() => Tone.start()}>
      <Switch>
        <Route exact path="/">
          <Workspace />
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
