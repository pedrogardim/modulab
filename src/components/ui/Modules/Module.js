import React, { useState, useEffect, Fragment } from "react";

import { Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";
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
  const { module, index, setModules, removeModule } = props;

  const [isMouseInside, setIsMouseInside] = useState(false);

  const moduleInfo = modulesInfo[module.type];

  const Component = components[module.type];

  return (
    <Draggable
      defaultPosition={{
        x: 32 * Math.round(module.x / 32),
        y: 32 * Math.round(module.y / 32),
      }}
      grid={[32, 32]}
      onStop={(e, data) =>
        setModules((prev) => {
          let newModules = [...prev];
          newModules[index] = {
            ...newModules[index],
            x: 32 * Math.round(data.x / 32),
            y: 32 * Math.round(data.y / 32),
          };
          return newModules;
        })
      }
      cancel=".module-jack, .MuiSlider-root, .knob"
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
        onMouseDown={(e) => {
          console.log(e);
        }}
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
