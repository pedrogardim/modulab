import React, { useState, useEffect, Fragment } from "react";

import {
  Icon,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@material-ui/core";

import { SliderPicker } from "react-color";

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
import SeqP16 from "./SeqP16";
import VCA from "./VCA";

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
  SeqP16: SeqP16,
  Trigger: Trigger,
  VCA: VCA,
};

function Module(props) {
  const { module, index, setModules, removeModule } = props;

  const [isMouseInside, setIsMouseInside] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [colorPicker, setColorPicker] = useState(false);
  const [color, setColor] = useState(module.c);

  const moduleInfo = modulesInfo[module.type];

  const Component = components[module.type];

  const onContextMenu = (e) => {
    e.preventDefault();
    setAnchorEl(e.target);
  };

  return (
    <>
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
          onContextMenu={onContextMenu}
        >
          <Component {...props} />
        </div>
      </Draggable>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setColorPicker(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Icon fontSize="small">palette</Icon>
          </ListItemIcon>
          <ListItemText>Color</ListItemText>
        </MenuItem>

        {moduleInfo.closeBtn !== false && (
          <MenuItem onClick={removeModule}>
            <ListItemIcon>
              <Icon fontSize="small">delete</Icon>
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <Dialog
        open={colorPicker}
        onClose={() => setColorPicker(false)}
        maxWidth="xs"
        fullWidth
        sx={{ p: 2 }}
      >
        <div style={{ margin: 16 }}>
          <SliderPicker
            color={color}
            onChange={(c) => setColor(c.hex)}
            onChangeComplete={(c) => {
              setModules((prev) => {
                let newModules = [...prev];
                newModules[index].c = c.hex;
                return newModules;
              });
            }}
          />
        </div>
      </Dialog>
    </>
  );
}

export default Module;
