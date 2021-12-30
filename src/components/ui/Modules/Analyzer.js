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
  const [logMode, setLogMode] = useState(false);

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

    let logArray = logMode
      ? oscdata.map((e, i) => {
          let thisLogIndex = Math.floor(
            linearToLogScale(i + 1, 1, oscdata.length + 1) - 1
          );
          let lastLogIndex = Math.floor(
            linearToLogScale(i, 1, oscdata.length + 1)
          );

          return lastLogIndex === thisLogIndex
            ? oscdata[thisLogIndex] -
                (oscdata[thisLogIndex] - oscdata[lastLogIndex])
            : oscdata[thisLogIndex];
        })
      : oscdata;

    logArray.map((e, i) => e);

    logArray.map((e, i) => {
      ctx.lineTo(
        (i + 1) / 8,
        ((e + -min) / range) * (-canvasHeight / 2) + canvasHeight,
        1,
        1
      );
    });

    ctx.stroke();
  };

  useEffect(() => {
    return () => {
      clearInterval(animator);
    };
  }, []);

  useEffect(() => {
    clearInterval(animator);
    setAnimator(
      setInterval(() => {
        let oscdata = props.nodes[0].getValue();
        drawWave(oscdata);
      }, 16)
    );
  }, [logMode]);

  return (
    <Draggable
      defaultPosition={{ x: props.module.x, y: props.module.y }}
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
          onClick={() => setLogMode((prev) => !prev)}
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

const linearToLogScale = (value, min, max) => {
  let b = Math.log(max / min) / (max - min);
  let a = max / Math.exp(b * max);
  let tempAnswer = a * Math.exp(b * value);

  return tempAnswer;
};
