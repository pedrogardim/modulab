export const modulesInfo = {
  Analyzer: {
    x: 512,
    y: 320,
    con: [["in", 0]],
    defaultParam: {},
    name: "Spectrum analyzer",
    description:
      "Visualizes the frequency and amplitude of an input signal, breaking it down into its constituent frequencies.",
  },
  ChMixer: {
    x: 512,
    y: 320,
    con: [
      ["in", 1],
      ["in", 2],
      ["in", 3],
      ["in", 4],
      ["out", 0],
    ],
    defaultParam: {
      1: {
        v: 0,
        m: false,
        p: 0,
      },
      2: {
        v: 0,
        m: false,
        p: 0,
      },
      3: {
        v: 0,
        m: false,
        p: 0,
      },
      4: {
        v: 0,
        m: false,
        p: 0,
      },
      0: {
        v: -12,
        m: false,
        p: 0,
      },
    },
    name: "4-channel mixer",
    description:
      "Blends audio signals from four separate input sources, allowing for individual volume control and unified output.",
  },
  Envelope: {
    x: 192,
    y: 320,
    con: [
      ["out", 0],
      ["in", 0],
    ],
    defaultParam: { a: 0.01, d: 0.1, s: 0.5, r: 0.1 },
    name: "Envelope",
    description:
      "Shapes the amplitude structure of an audio signal, based on the ADSR (attack, decay, sustain, release) parameters.",
  },
  Filter: {
    x: 128,
    y: 320,
    con: [
      ["in", 0],
      ["out", 0],
    ],
    defaultParam: { f: 500, q: 1, t: 0 },
    name: "Filter",
    description:
      "Processes an audio signal by altering its frequency content, allowing certain frequencies to pass through while reducing or eliminating others.",
  },
  LFO: {
    x: 128,
    y: 320,
    con: [["out", 0]],
    defaultParam: { f: 1, t: 0 },
    name: "LFO",
    description:
      "Generates a waveform usually below the audible range and is used to modulate another parameter, such as pitch, volume, or filter cutoff.",
  },
  MasterOut: {
    x: 128,
    y: 128,
    closeBtn: false,
    con: [["in", 0]],
    defaultParam: {},
    name: "Master Out",
    description:
      "Main output point, delivering the final mixed sound to speakers, headphones, or recording devices.",
  },
  NoiseGenerator: {
    x: 128,
    y: 320,
    con: [["out", 0]],
    defaultParam: { r: 1, t: 0 },
    name: "Noise Generator",
    description: "Produces a range of noise types, like white or pink noise.",
  },
  Oscillator: {
    x: 128,
    y: 320,
    con: [
      ["mod", 1],
      ["pitch", 0],
      ["out", 0],
    ],
    defaultParam: { f: 440, t: 0, md: 55, d: 0 },
    name: "Oscillator",
    description:
      "Generates periodic waveforms, such as sine, square, and sawtooth, serving as a primary sound source.",
  },
  Oscilloscope: {
    x: 512,
    y: 320,
    con: [["in", 0]],
    defaultParam: {},
    name: "Oscilloscope",
    description: "Visual instrument that displays signals as waveforms.",
  },
  SeqP16: {
    x: 512,
    y: 96,
    con: [
      ["out", 0],
      ["out", 1],
    ],
    defaultParam: {
      steps: new Array(16).fill(false),
      p: new Array(16).fill(60),
      m: false,
    },
    name: "Sequencer",
    description:
      "Arranges and orders a series of sounds or musical notes, enabling the creation and playback of patterns.",
  },
  VCA: {
    x: 256,
    y: 128,
    con: [
      ["in", 0],
      ["out", 0],
      ["mod", 1],
    ],
    defaultParam: { v: 0, md: 0 },
    name: "Amplifier / VCA",
    description:
      "Increases the power or amplitude of a signal, enhancing its strength.",
  },
  Meter: {
    x: 128,
    y: 128,
    con: [["in", 0]],
    name: "Meter",
    description: "Outputs the amplitude of the signal",
  },
  SignalOp: {
    x: 256,
    y: 128,
    defaultParam: { op: 0, v: 0 },
    con: [
      ["in", 0],
      ["out", 1],
    ],
    name: "Signal Operator",
    description: "Processes or manipulates audio signals mathmatically.",
  },
};
