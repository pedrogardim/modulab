import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Button, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function Envelope(props) {
  const updateCurve = (curve) => {
    var canvas = document.getElementById(`envelope-canvas-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    //find first phase

    ctx.strokeStyle = "#3f51b5";
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);

    curve.map((e, i) =>
      ctx.lineTo(i + 1, canvasHeight - e * canvasHeight, 1, 1)
    );

    ctx.stroke();
  };
  /* 
  const triggerOn = () => {
    props.nodes[2].value = 1;
  };

  const triggerOff = () => {
    props.nodes[2].value = 0;
  }; */

  useEffect(() => {
    props.nodes[0].asArray(144).then((r) => updateCurve(r));
  }, [
    props.nodes[0].attack,
    props.nodes[0].decay,
    props.nodes[0].sustain,
    props.nodes[0].release,
  ]);

  /* useEffect(() => {
    if (props.nodes[2]) {
      props.nodes[2].value === 1
        ? props.nodes[0].triggerAttack()
        : props.nodes[0].triggerRelease();
    }
  }, [props.nodes[2] && props.nodes[2].value]);
 */
  return (
    <>
      <canvas
        height={96}
        width={144}
        id={"envelope-canvas-" + props.module.id}
        style={{ pointerEvents: "none", imageRendering: "pixelated" }}
      />

      <div className="break" />

      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={props.nodes[0].attack}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          props.nodes[0].set({ attack: v });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={5}
        defaultValue={props.nodes[0].decay}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          props.nodes[0].set({ decay: v });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={props.nodes[0].sustain}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          props.nodes[0].set({ sustain: v });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={props.nodes[0].release}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          props.nodes[0].set({ release: v });
        }}
      />

      <div className="break" />

      <Button
        onMouseDown={() => props.nodes[0].triggerAttack()}
        onMouseUp={() => props.nodes[0].triggerRelease()}
        variant="outlined"
        color="primary"
      >
        Trigger
      </Button>
      <div className="break" />

      <Jack
        type="in"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />

      <Jack
        type="trigger"
        label="Trigger"
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
    </>
  );
}

export default Envelope;
