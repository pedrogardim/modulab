import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

let lightIntensity = 0;

function LFO(props) {
  const [LEDLvl, setLEDLvl] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setLEDLvl(props.nodes[1].getValue());
    }, 16);
  }, []);

  return (
    <Draggable
      defaultPostion={{ x: props.module.x, y: props.module.y }}
      onStop={(e, data) =>
        props.setModules((prev) => {
          let newModules = [...prev];
          newModules[props.index] = {
            ...newModules[props.index],
            x: data.x,
            y: data.y,
          };
          return newModules;
        })
      }
      cancel=".module-jack, .MuiSlider-root, .module-knob"
    >
      <Card
        className="module"
        style={{
          height: 300,
          width: 200,
        }}
      >
        <IconButton className="close-btn" onClick={props.removeModule}>
          <Icon>close</Icon>
        </IconButton>

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
          defaultValue={props.nodes[0].frequency.value}
          onChange={(v) => {
            props.nodes[0].set({ frequency: v });
          }}
          mousePosition={props.mousePosition}
        />
        <div className="break" />
        <Select
          native
          onChange={(e) => props.nodes[0].set({ type: e.target.value })}
          defaultValue={props.nodes[0].type}
        >
          {["sine", "square", "sawtooth", "triangle"].map((e) => (
            <option value={e}>{e}</option>
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
      </Card>
    </Draggable>
  );
}

export default LFO;
