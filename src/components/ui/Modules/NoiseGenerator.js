import React from "react";
import { Select, MenuItem } from "@material-ui/core";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function NoiseGenerator(props) {
  return (
    <>
      <Knob
        exp
        size={64}
        min={0}
        step={0.1}
        max={5}
        defaultValue={props.nodes[0].playbackRate}
        onChange={(v) => {
          props.nodes[0].playbackRate = v;
        }}
        color="lightgray"
        mousePosition={props.mousePosition}
      />
      <div className="break" />
      <Select
        onChange={(e) => props.nodes[0].set({ type: e.target.value })}
        defaultValue={props.nodes[0].type}
      >
        {["white", "brown", "pink"].map((e) => (
          <MenuItem value={e}>{e}</MenuItem>
        ))}
      </Select>
      <div className="break" />

      <Jack
        type="out"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      {/* <Jack
          type="mod"
          index={1}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        /> */}
    </>
  );
}

export default NoiseGenerator;
