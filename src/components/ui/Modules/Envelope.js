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
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  const updateCurve = async () => {
    var canvas = document.getElementById(`envelope-canvas-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    //find first phase

    ctx.strokeStyle = "#3f51b5";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);

    let curve = await props.nodes[0].asArray(canvasWidth);

    curve.map((e, i) => {
      i === 0 && ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.lineTo(i + 1, canvasHeight - e * canvasHeight, 1, 1);
    });

    ctx.stroke();
  };

  const triggerOn = () => {
    props.nodes[2].value = 1;
  };

  const triggerOff = () => {
    props.nodes[2].value = 0;
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
      if (props.nodes[2].value === 1 && !hasBeenTriggered) {
        props.nodes[0].triggerAttack();
        setHasBeenTriggered(true);
      } else if (props.nodes[2].value === 0 && hasBeenTriggered) {
        props.nodes[0].triggerRelease();
        setHasBeenTriggered(false);
      }
    }, 1);
  }, []);

  /*  useEffect(() => {
    setInterval(() => {
      console.log(props.nodes[2].value, props.nodes[2].overridden);
    }, 1000);
  }, []); */

  useEffect(() => {
    console.log(hasBeenTriggered);
  }, [hasBeenTriggered]);

  useEffect(() => {
    console.log(props.nodes[2].value);
  }, [props.nodes[2].value]);

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

        <canvas
          height={96}
          width={144}
          id={"envelope-canvas-" + props.module.id}
        />

        <div className="break" />

        <Knob
          size={36}
          min={0}
          step={0.2}
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
          step={0.1}
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
          step={0.05}
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
          step={0.2}
          max={10}
          defaultValue={props.nodes[0].release}
          mousePosition={props.mousePosition}
          onChange={(v) => {
            props.nodes[0].set({ release: v });
          }}
        />

        <div className="break" />

        <button onMouseDown={triggerOn} onMouseUp={triggerOff}>
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
          type="mod"
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
      </Card>
    </Draggable>
  );
}

export default Envelope;
