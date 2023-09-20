import { useState } from "react";
import { useDispatch } from "@/store/hooks";
import { SliderPicker } from "react-color";

import Draggable from "react-draggable";
import Oscillator from "../../modules/Oscillator";
import NoiseGenerator from "../../modules/NoiseGenerator";
import MasterOut from "../../modules/MasterOut";
import LFO from "../../modules/LFO";
import Filter from "../../modules/Filter";
import Envelope from "../../modules/Envelope";
import ChMixer from "../../modules/ChMixer";
import Oscilloscope from "../../modules/Oscilloscope";
import Analyzer from "../../modules/Analyzer";
import Trigger from "../../modules/Trigger";
import SeqP16 from "../../modules/SeqP16";
import VCA from "../../modules/VCA";
import Meter from "../../modules/Meter";
import SignalOp from "../../modules/SignalOp";

import { modulesInfo } from "@/utils/modulesInfo";
import { updateModulePosition } from "@/store/sessionSlice";

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
  Meter: Meter,
  SignalOp: SignalOp,
};

function Module(props) {
  const { module, index: moduleIndex } = props;

  const dispatch = useDispatch();

  const moduleInfo = modulesInfo[module.type];
  const Component = components[module.type];

  return (
    <>
      <Draggable
        defaultPosition={{
          x: 32 * Math.round(module.x / 32),
          y: 32 * Math.round(module.y / 32),
        }}
        grid={[32, 32]}
        onStop={(_, { x, y }) => {
          dispatch(updateModulePosition({ moduleIndex, x, y }));
        }}
        cancel=".module-jack, .MuiSlider-root, .knob, .text-input, input"
      >
        <div
          className="module outline-0 hover:outline-1"
          style={{
            width: moduleInfo.x,
            height: moduleInfo.y,
            outlineColor: module.c,
          }}
          // onContextMenu={onContextMenu}
        >
          <Component {...props} />
        </div>
      </Draggable>
    </>
  );
}

export default Module;
