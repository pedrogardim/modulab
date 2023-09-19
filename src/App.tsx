import "./App.css";

import { useState, useEffect } from "react";

import * as Tone from "tone";

import Workspace from "./components/workspace/Workspace";

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
      <Workspace />
    </div>
  );
}

export default App;
