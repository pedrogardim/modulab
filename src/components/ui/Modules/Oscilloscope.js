import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";

function Oscilloscope(props) {
  const [animator, setAnimator] = useState(null);

  const drawWave = (oscdata) => {
    var canvas = document.getElementById(`oscilloscope-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    //find first phase

    let wave = oscdata.filter(
      (e, i) => i > oscdata.findIndex((e) => e > -0.005 && e < 0.005)
    );

    if (wave[1] > wave[0]) {
      return;
    }

    ctx.strokeStyle = "#3f51b5";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    let max = Math.max(...wave) - 8;

    wave.map((e, i) => {
      ctx.lineTo(i + 1, (e / max) * canvasHeight + canvasHeight / 2, 1, 1);
    });

    ctx.stroke();
  };

  useEffect(() => {
    setAnimator(
      setInterval(() => {
        let oscdata = props.nodes[0].getValue();
        drawWave(oscdata);
      }, 32)
    );
    return () => {
      clearInterval(animator);
    };
  }, []);

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
          id={`oscilloscope-${props.module.id}`}
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

export default Oscilloscope;
