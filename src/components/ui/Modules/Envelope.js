import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function Envelope(props) {
  const [linePoints, setLinePoints] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  const updateCurve = () => {
    let totalTime =
      props.nodes[0].attack + props.nodes[0].decay + props.nodes[0].release + 2;

    let point1 = [(props.nodes[0].attack / totalTime) * 144, 0];
    let point2 = [
      ((props.nodes[0].attack + props.nodes[0].decay) / totalTime) * 144,
      96 - props.nodes[0].sustain * 96,
    ];

    let point3 = [
      144 - (props.nodes[0].release / totalTime) * 144,
      96 - props.nodes[0].sustain * 96,
    ];

    setLinePoints([point1, point2, point3]);
  };

  useEffect(() => {
    updateCurve();
  }, [
    props.nodes[0].attack,
    props.nodes[0].decay,
    props.nodes[0].sustain,
    props.nodes[0].release,
  ]);

  useEffect(() => {
    setInterval(() => {
      if (props.nodes[2].getValue() >= -3 && props.nodes[0].value === 0) {
        props.nodes[0].cancel();
        props.nodes[0].triggerAttackRelease();
      }
    }, 16);
  }, []);

  return (
    <Draggable cancel=".module-jack, .MuiSlider-root, .module-knob">
      <Card
        className="module"
        style={{
          height: 360,
          width: 160,
        }}
      >
        <IconButton className="close-btn" onClick={props.removeModule}>
          <Icon>close</Icon>
        </IconButton>

        <span></span>

        <svg height={96} width={144} style={{ overflow: "visible" }}>
          <path
            stroke="#3f51b5"
            stroke-width="4px"
            fill="transparent"
            d={`M 0 100 L ${linePoints[0][0]} ${linePoints[0][1]} L ${linePoints[1][0]} ${linePoints[1][1]} L ${linePoints[2][0]} ${linePoints[2][1]} L 144 100`}
          />
        </svg>
        <div className="break" />

        <Knob
          size={36}
          min={0}
          step={0.2}
          max={10}
          defaultValue={props.nodes[0].attack}
          onChange={(v) => {
            props.nodes[0].set({ attack: v });
          }}
        />
        <Knob
          size={36}
          min={0}
          step={0.1}
          max={5}
          defaultValue={props.nodes[0].decay}
          onChange={(v) => {
            props.nodes[0].set({ decay: v });
          }}
        />
        <Knob
          size={36}
          min={0}
          step={0.05}
          max={1}
          defaultValue={props.nodes[0].sustain}
          onChange={(v) => {
            props.nodes[0].set({ sustain: v });
          }}
        />
        <Knob
          size={36}
          min={0}
          step={0.2}
          max={10}
          defaultValue={props.nodes[0].release}
          onChange={(v) => {
            props.nodes[0].set({ release: v });
          }}
        />

        <div className="break" />

        <button
          onMouseDown={() => props.nodes[0].triggerAttack()}
          onMouseUp={() => props.nodes[0].triggerRelease()}
        >
          Trigger
        </button>
        <div className="break" />

        <Jack
          type="in"
          index={0}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />

        <Jack
          type="in"
          index={2}
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
      </Card>
    </Draggable>
  );
}

export default Envelope;
