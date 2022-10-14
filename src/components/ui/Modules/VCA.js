import React, { useState, useEffect, Fragment, useRef } from "react";
import * as Tone from "tone";

import { useTranslation } from "react-i18next";

import { Card, Icon, IconButton, Button } from "@material-ui/core";

import Draggable from "react-draggable";
import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function VCA(props) {
  const { setModules, index, module } = props;

  return (
    <>
      <Jack
        type="in"
        label="In"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Knob
        label={"Gain"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.v}
        onChange={(v) => {
          props.nodes[0].set({ gain: v });
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
      <Jack
        type="mod"
        label="mod"
        index={2}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Knob
        label={"CV"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.md}
        onChange={(v) => {
          props.nodes[1].set({ gain: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.md = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <Jack
        type="out"
        label="out"
        index={1}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default VCA;
