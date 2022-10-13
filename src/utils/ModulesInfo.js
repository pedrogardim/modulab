export const modulesInfo = {
  Analyzer: {
    x: 512,
    y: 320,
    con: [["in", 0]],
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
  },
  Envelope: {
    x: 192,
    y: 320,
    con: [
      ["in", 0],
      ["trigger", 0],
      ["out", 0],
    ],
  },
  Filter: {
    x: 128,
    y: 320,
    con: [
      ["in", 0],
      ["out", 0],
    ],
  },
  LFO: {
    x: 128,
    y: 320,
    con: [["out", 0]],
  },
  MasterOut: {
    x: 128,
    y: 128,
    closeBtn: false,
    con: [["in", 0]],
  },
  NoiseGenerator: {
    x: 128,
    y: 320,
    con: [["out", 0]],
  },
  Oscillator: {
    x: 128,
    y: 320,
    con: [
      ["mod", 1],
      ["pitch", 0],
      ["out", 0],
    ],
  },
  Oscilloscope: {
    x: 512,
    y: 320,
    con: [["in", 0]],
  },
  SeqP16: {
    x: 512,
    y: 96,
    con: [
      ["triggerout", 0],
      ["pitchout", 0],
    ],
  },
  Trigger: {
    x: 320,
    y: 64,
    con: [["triggerout", 0]],
  },
};
