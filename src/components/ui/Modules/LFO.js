import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "../input";
let lightIntensity = 0;

function LFO(props) {
  const [LEDLvl, setLEDLvl] = useState(0);
  const { module, setModules, index } = props;

  useEffect(() => {
    setInterval(() => {
      setLEDLvl(props.nodes[1].getValue());
    }, 16);
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: "red",
          filter: `brightness(${1 + LEDLvl / 23})`,
          position: "absolute",
          height: 16,
          width: 16,
          top: 8,
          left: 8,
          borderRadius: "100%",
        }}
      ></div>
      <Knob
        exp
        size={72}
        min={0.1}
        step={0.1}
        max={10}
        color="green"
        defaultValue={module.p.f}
        onChange={(v) => {
          props.nodes[0].set({ frequency: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.f = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <div className="break" />
      <Select
        native
        onChange={(e) => {
          props.nodes[0].set({
            type: ["sine", "square", "sawtooth", "triangle"][
              parseInt(e.target.value)
            ],
          });
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.t = parseInt(e.target.value);
            return newModules;
          });
        }}
        defaultValue={props.nodes[0].type}
      >
        {["sine", "square", "sawtooth", "triangle"].map((e, i) => (
          <option value={i}>{e}</option>
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

export default LFO;
