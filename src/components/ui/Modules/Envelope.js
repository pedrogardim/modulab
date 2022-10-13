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
  const {
    setModules,
    index,
    nodes,
    module,
    mousePosition,
    setDrawingLine,
    drawingLine,
  } = props;
  const updateCurve = (curve) => {
    var canvas = document.getElementById(`envelope-canvas-${module.id}`);
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
    nodes[2].value = 1;
  };

  const triggerOff = () => {
    nodes[2].value = 0;
  }; */

  useEffect(() => {
    nodes[0].asArray(144).then((r) => updateCurve(r));
  }, [nodes[0].attack, nodes[0].decay, nodes[0].sustain, nodes[0].release]);

  /* useEffect(() => {
    if (nodes[2]) {
      nodes[2].value === 1
        ? nodes[0].triggerAttack()
        : nodes[0].triggerRelease();
    }
  }, [nodes[2] && nodes[2].value]);
 */
  return (
    <>
      <canvas
        height={96}
        width={144}
        id={"envelope-canvas-" + module.id}
        style={{ pointerEvents: "none", imageRendering: "pixelated" }}
      />

      <div className="break" />

      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={module.p.a}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0].set({ attack: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.a = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={5}
        defaultValue={module.p.d}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0].set({ decay: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.d = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.s}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0].set({ sustain: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.s = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={module.p.r}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0].set({ release: v });
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.r = v;
            return newModules;
          });
        }}
      />

      <div className="break" />

      <Button
        onMouseDown={() => nodes[0].triggerAttack()}
        onMouseUp={() => nodes[0].triggerRelease()}
        variant="outlined"
        color="primary"
      >
        Trigger
      </Button>
      <div className="break" />

      <Jack
        type="in"
        index={0}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      />

      <Jack
        type="trigger"
        label="Trigger"
        index={1}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      />

      <Jack
        type="out"
        index={2}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      />
    </>
  );
}

export default Envelope;
