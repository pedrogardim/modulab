import * as Tone from "tone";

import { getRandomColor } from "@/utils/colorUtils";

import { modulesInfo } from "./modulesInfo";

import { EnvelopeNode } from "@/customNodes/EnvelopeNode";

type ModuleType = keyof typeof modulesInfo;
type Module = (typeof modulesInfo)[keyof typeof modulesInfo];

export const createModule = (
  type: ModuleType,
  module?: Module,
  moduleId?: number,
  recorder: Tone.Recorder
) => {
  let newModule = module
    ? { ...module }
    : {
        id: moduleId,
        type: type,
        x: 0,
        y: 4500,
        c: getRandomColor(),
        p: { ...modulesInfo[type].defaultParam },
      };

  // if (modules.findIndex((e) => newModule.id === e.id) !== -1) {
  //   return;
  // }

  let nodes;

  switch (type) {
    case "MasterOut":
      let limiter = new Tone.Limiter(0).connect(recorder).toDestination();
      nodes = [limiter];
      break;
    case "Oscillator":
      let osc = new Tone.Oscillator({
        frequency: newModule.p.f,
        type: ["sine", "square", "sawtooth", "triangle"][newModule.p.t],
        detune: newModule.p.d,
      }).start();
      let modGain = new Tone.Gain(1).connect(osc.frequency);
      nodes = [osc, modGain];
      break;
    case "NoiseGenerator":
      let noise = new Tone.Noise(
        ["white", "brown", "pink"][newModule.p.t]
      ).start();
      nodes = [noise];
      break;
    case "LFO":
      let meter = new Tone.Meter();
      let lfo = new Tone.LFO({
        frequency: newModule.p.f,
        type: ["sine", "square", "sawtooth", "triangle"][newModule.p.t],
        min: 0,
        max: 1,
        amplitude: 1,
      })
        .start()
        .connect(meter);
      nodes = [lfo, meter];
      break;
    case "Oscilloscope":
      let waveform = new Tone.Waveform(1024);
      nodes = [waveform];
      break;
    case "Analyzer":
      let fftAnalyzer = new Tone.FFT(4096);
      nodes = [fftAnalyzer];
      break;
    case "Filter":
      let gain = new Tone.Limiter(0);
      let filter = new Tone.Filter({
        frequency: newModule.p.f,
        Q: newModule.p.q,
        type: ["lowpass", "highpass", "bandpass"][newModule.p.t],
      }).connect(gain);
      nodes = [filter, gain];
      break;
    case "Envelope":
      const context = Tone.getContext().rawContext;
      let envelope = new EnvelopeNode(context, {
        attack: newModule.p.a,
        decay: newModule.p.d,
        sustain: newModule.p.s,
        release: newModule.p.r,
      });
      nodes = [envelope];
      break;

    case "ChMixer":
      let master = new Tone.Channel({
        volume: newModule.p[0].v,
        pan: newModule.p[0].p,
        mute: newModule.p[0].m,
      });
      let channels = Array(4)
        .fill(0)
        .map((e, i) =>
          new Tone.Channel({
            volume: newModule.p[i + 1].v,
            pan: newModule.p[i + 1].p,
            mute: newModule.p[i + 1].m,
          }).connect(master)
        );
      nodes = [master, ...channels];
      break;
    case "VCA":
      let amp = new Tone.Gain(0, "normalRange");
      let controlGain = new Tone.Gain(0, "audioRange").connect(amp.gain);

      nodes = [amp, controlGain];
      break;
    case "SeqP16":
      nodes = [
        new Tone.Signal(0, "normalRange"),
        new Tone.Signal(440, "number"),
      ];
      break;
    case "Meter":
      nodes = [new Tone.DCMeter()];
      break;
    //   case "Signal":
    //     nodes = [new Tone.Signal()];
    //   break;
    case "SignalOp":
      nodes = [new Tone.Signal(), new Tone.Signal()];
      break;
    default:
      break;
  }

  return { nodes, moduleInfo: newModule };
};
