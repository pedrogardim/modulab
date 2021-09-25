import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function Oscillator(props) {
  return (
    <Draggable cancel=".module-jack, .MuiSlider-root, .module-knob">
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
        <Knob
          exp
          size={64}
          min={20}
          step={1}
          max={20000}
          defaultValue={props.nodes[0].frequency.value}
          onChange={(v) => {
            props.nodes[0].set({ frequency: v });
          }}
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
        <Jack
          type="mod"
          index={1}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />

        <Knob
          exp
          size={36}
          min={0}
          step={1}
          max={100000}
          defaultValue={props.nodes[1].gain.value}
          onChange={(v) => {
            props.nodes[1].set({ gain: v });
          }}
        />
      </Card>
    </Draggable>
  );
}

export default Oscillator;
