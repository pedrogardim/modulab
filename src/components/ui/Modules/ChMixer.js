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
  const [mixerParams, setMixerParams] = useState(
    [1, 2, 3, 4, 0].map((e) => ({
      muted: props.nodes[e].mute,
      volume: props.nodes[e].volume.value,
      pan: props.nodes[e].pan.value,
      id: e,
    }))
  );
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
        {mixerParams.map((e, i) => (
          <Slider
            style={{
              height: 150,
              filter: e.muted && "saturate(0)",
              pointerEvents: e.muted && "none",
            }}
            orientation="vertical"
            value={parseInt(e.volume)}
            onChange={(_, v) => {
              setMixerParams((prev) => {
                let par = [...prev];
                par[i].volume = v;
                return par;
              });
              props.nodes[e.id].volume.value = v;
            }}
            color={e === 0 ? "secondary" : "primary"}
            min={-61}
            max={10}
            valueLabelDisplay="auto"
          />
        ))}
        <div className="break" style={{ height: 8 }} />

        {mixerParams.map((e, i) => (
          <Knob
            mousePosition={props.mousePosition}
            type={e === 0 ? "out" : "in"}
            step={0.05}
            min={-1}
            max={1}
            defaultValue={e.pan}
            size={24}
            onChange={(v) => {
              setMixerParams((prev) => {
                let par = [...prev];
                par[i].pan = v;
                return par;
              });
              props.nodes[e.id].pan.value = v;
            }}
          />
        ))}

        <div className="break" style={{ height: 8 }} />

        {mixerParams.map((e, i) => (
          <Button
            onClick={() =>
              setMixerParams((prev) => {
                let par = [...prev];
                par[i].muted = !par[i].muted;
                props.nodes[e.id].mute = par[i].muted;
                return par;
              })
            }
            color={mixerParams[i].muted ? "secondary" : "primary"}
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
