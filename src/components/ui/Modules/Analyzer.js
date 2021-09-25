import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";

function Analyzer(props) {
  const [animator, setAnimator] = useState(null);

  const drawWave = (oscdata) => {
    var canvas = document.getElementById(`analyzer-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    ctx.strokeStyle = "#3f51b5";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    let max = Math.max(...oscdata);
    let min = Math.min(...oscdata);

    let range = Math.abs(max - min);

    oscdata.map((e, i) => {
      ctx.lineTo(
        i + 1,
        ((e + -min) / range) * (-canvasHeight / 2) + canvasHeight,
        1,
        1
      );
    });

    ctx.stroke();
  };

  useEffect(() => {
    setAnimator(
      setInterval(() => {
        let oscdata = props.nodes[0].getValue();
        drawWave(oscdata);
      }, 16)
    );
    return () => {
      clearInterval(animator);
    };
  }, []);

  return (
    <Draggable cancel=".module-jack, .MuiSlider-root, .module-knob">
      <Card
        className="module"
        style={{
          height: 300,
          width: 512,
        }}
      >
        <IconButton className="close-btn" onClick={props.removeModule}>
          <Icon>close</Icon>
        </IconButton>

        <canvas
          height="250px"
          width="512px"
          id={`analyzer-${props.module.id}`}
          style={{ imageRendering: "pixelated" }}
        />
        <Jack
          type="in"
          index={0}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />
      </Card>
    </Draggable>
  );
}

export default Analyzer;
