import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Slider, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

import Oscillator from "./Oscillator";
import NoiseGenerator from "./NoiseGenerator";
import MasterOut from "./MasterOut";
import LFO from "./LFO";
import Filter from "./Filter";
import Envelope from "./Envelope";
import ChMixer from "./ChMixer";
import Oscilloscope from "./Oscilloscope";
import Analyzer from "./Analyzer";
import Trigger from "./Trigger";

import { modulesInfo } from "../../../utils/modulesInfo";

const components = {
  Oscillator: Oscillator,
  NoiseGenerator: NoiseGenerator,
  MasterOut: MasterOut,
  LFO: LFO,
  Filter: Filter,
  Envelope: Envelope,
  ChMixer: ChMixer,
  Oscilloscope: Oscilloscope,
  Analyzer: Analyzer,
  Trigger: Trigger,
};

function Module(props) {
  const {
    module,
    mousePosition,
    setDrawingLine,
    index,
    setModules,
    drawingLine,
    removeModule,
    nodes,
  } = props;

  const [isMouseInside, setIsMouseInside] = useState(false);

  const moduleInfo = modulesInfo[module.type];

  const Component = components[module.type];

  return (
    <Draggable
      defaultPosition={{
        x: Math.round(module.x * 32) / 32,
        y: Math.round(module.y * 32) / 32,
      }}
      grid={[32, 32]}
      onStop={(e, data) =>
        setModules((prev) => {
          let newModules = [...prev];
          newModules[index] = {
            ...newModules[index],
            x: data.x,
            y: data.y,
          };
          return newModules;
        })
      }
      cancel=".module-jack, .MuiSlider-root, .module-knob"
    >
      <div
        className="module"
        style={{
          width: moduleInfo.x,
          height: moduleInfo.y,
          outline: isMouseInside && "solid 1px " + module.c,
        }}
        onMouseMove={() => setIsMouseInside(true)}
        onMouseEnter={() => setIsMouseInside(true)}
        onMouseLeave={() => setIsMouseInside(false)}
        onMouseUp={() => setIsMouseInside(false)}
      >
        {moduleInfo.closeBtn !== false && (
          <IconButton className="close-btn" onClick={removeModule}>
            <Icon>close</Icon>
          </IconButton>
        )}

        <Component {...props} />
      </div>
    </Draggable>
  );
}

export default Module;
