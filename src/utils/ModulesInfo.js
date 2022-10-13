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
      ["trigger", 2],
      ["out", 1],
    ],
  },
  Filter: {
    x: 128,
    y: 320,
    con: [
      ["in", 0],
      ["out", 1],
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
      ["out", 0],
      ["mod", 1],
    ],
  },
  Oscilloscope: {
    x: 512,
    y: 320,
    con: [["in", 0]],
  },
  Trigger: {
    x: 320,
    y: 128,
    con: [["triggerout", 0]],
  },
};
