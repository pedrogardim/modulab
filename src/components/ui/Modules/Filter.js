import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function Filter(props) {
  return (
    <>
      <Knob
        exp
        logScale
        size={80}
        min={20}
        step={1}
        max={20000}
        color="brown"
        defaultValue={props.nodes[0].frequency.value}
        onChange={(v) => {
          props.nodes[0].set({ frequency: v });
        }}
        mousePosition={props.mousePosition}
      />
      <div className="break" />

      <Knob
        size={32}
        min={0}
        step={0.5}
        max={40}
        defaultValue={props.nodes[0].Q.value}
        onChange={(v) => {
          props.nodes[0].set({ Q: v });
        }}
        mousePosition={props.mousePosition}
      />

      <div className="break" />
      <Select
        native
        onChange={(e) => props.nodes[0].set({ type: e.target.value })}
        defaultValue={props.nodes[0].type}
      >
        {["lowpass", "highpass", "bandpass"].map((e) => (
          <option value={e}>{e}</option>
        ))}
      </Select>
      <div className="break" />

      <Jack
        type="in"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Jack
        type="out"
        index={1}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default Filter;
