import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Slider, Icon, IconButton, Button } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function ChMixer(props) {
  return (
    <Draggable
      defaultPostion={{ x: props.module.x, y: props.module.y }}
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
      cancel=".module-jack, .MuiSlider-root"
    >
      <Card
        className="module"
        style={{
          height: 300,
          width: 500,
          alignContent: "center",
        }}
      >
        <IconButton className="close-btn" onClick={props.removeModule}>
          <Icon>close</Icon>
        </IconButton>
        {[1, 2, 3, 4, 0].map((e) => (
          <Slider
            style={{
              height: 150,
              filter: props.nodes[e].muted && "saturate(0)",
              pointerEvents: props.nodes[e].muted && "none",
            }}
            orientation="vertical"
            value={parseInt(props.nodes[e].volume.value)}
            onChange={(_, v) => {
              props.nodes[e].volume.value = v;
            }}
            color={e === 0 ? "secondary" : "primary"}
            min={-61}
            max={10}
            valueLabelDisplay="auto"
          />
        ))}
        <div className="break" style={{ height: 8 }} />

        {[1, 2, 3, 4, 0].map((e) => (
          <Knob
            mousePosition={props.mousePosition}
            type={e === 0 ? "out" : "in"}
            step={0.05}
            min={-1}
            max={1}
            defaultValue={props.nodes[0].pan.value}
            size={24}
            onChange={(v) => {
              props.nodes[e].pan.value = v;
            }}
          />
        ))}

        <div className="break" style={{ height: 8 }} />

        {[1, 2, 3, 4, 0].map((e) => (
          <Button
            onClick={() => {
              props.nodes[e].mute = !props.nodes[e].muted;
            }}
          >
            M
          </Button>
        ))}

        <div className="break" style={{ height: 8 }} />

        {[1, 2, 3, 4, 0].map((e) => (
          <Jack
            type={e === 0 ? "out" : "in"}
            index={e}
            module={props.module}
            setDrawingLine={props.setDrawingLine}
            drawingLine={props.drawingLine}
          />
        ))}
      </Card>
    </Draggable>
  );
}

export default ChMixer;
