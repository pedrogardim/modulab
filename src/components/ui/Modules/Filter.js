import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "../input";
function Filter(props) {
  const { nodes, setModules, index, module } = props;
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
        defaultValue={module.p.f}
        onChange={(v) => {
          props.nodes[0].set({ frequency: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.f = v;
            return newModules;
          });
        }}
        mousePosition={props.mousePosition}
      />
      <div className="break" />

      <Knob
        size={32}
        min={0}
        step={0.5}
        max={20}
        defaultValue={module.p.q}
        onChange={(v) => {
          props.nodes[0].set({ Q: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.q = v;
            return newModules;
          });
        }}
        mousePosition={props.mousePosition}
      />

      <div className="break" />
      <Select
        native
        onChange={(e) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.t = parseInt(e.target.value);
            return newModules;
          });
          props.nodes[0].set({
            type: ["lowpass", "highpass", "bandpass"][parseInt(e.target.value)],
          });
        }}
        defaultValue={module.p.t}
      >
        {["lowpass", "highpass", "bandpass"].map((e, i) => (
          <option value={i}>{e}</option>
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
