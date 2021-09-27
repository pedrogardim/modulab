import React, { useState, useEffect, Fragment, useRef } from "react";
import * as Tone from "tone";

import { useTranslation } from "react-i18next";

import { Card, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";
import Jack from "./Components/Jack";

function Trigger(props) {
  const { t } = useTranslation();

  const [LEDLvl, setLEDLvl] = useState(0);

  const triggerOn = () => {
    props.nodes[0].value = 1;
  };

  const triggerOff = () => {
    props.nodes[0].value = 0;
  };

  useEffect(() => {
    setInterval(() => {
      setLEDLvl(props.nodes[0].value);
    }, 16);
  }, []);

  return (
    <Draggable cancel=".module-jack, .module-knob">
      <Card
        className="module"
        style={{
          height: 150,
          width: 250,
        }}
      >
        <div
          style={{
            backgroundColor: "red",
            filter: `brightness(${LEDLvl})`,
            position: "absolute",
            height: 16,
            width: 16,
            top: 8,
            left: 8,
            borderRadius: "100%",
          }}
        ></div>
        <button onMouseDown={triggerOn} onMouseUp={triggerOff}>
          Trigger
        </button>
        <div className="break" />
        <Jack
          type="out"
          label="Trigger Out"
          index={0}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />
      </Card>
    </Draggable>
  );
}

export default Trigger;
