import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

import { TextField } from "@material-ui/core";

function Signal(props) {
  const { setModules, index, module } = props;

  const [value, setValue] = useState(module.p.v);

  return (
    <>
      <TextField
        className="text-input"
        value={value}
        onChange={(e) => {
          props.nodes[0].setValueAtTime(e.target.value, Tone.now());
          setValue(e.target.value);
        }}
      />
      <Knob
        label={"Gain"}
        size={36}
        min={0}
        step={0.01}
        max={2}
        defaultValue={module.p.v}
        onChange={(v) => {
          props.nodes[0].setValueAtTime(v, Tone.now());
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.v = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <div className="break" />
      <Jack
        type="out"
        label="out"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default Signal;
