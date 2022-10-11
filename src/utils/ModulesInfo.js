export const modulesInfo = {
  Analyzer: {
    x: 512,
    y: 288,
    con: [["in", 0]],
  },
  ChMixer: {
    x: 512,
    y: 288,
    con: [
      ["in", 1],
      ["in", 2],
      ["in", 3],
      ["in", 4],
      ["out", 0],
    ],
  },
  Envelope: {
    x: 160,
    y: 320,
    con: [["in", 0][("trigger", 2)], ["out", 1]],
  },
  Filter: {
    x: 160,
    y: 320,
    con: [["in", 0], "out", 1],
  },
  LFO: {
    x: 160,
    y: 320,
    con: [["out", 0]],
  },
  MasterOut: {
    x: 96,
    y: 96,
    closeBtn: false,
    con: [["in", 0]],
  },
  NoiseGenerator: {
    x: 160,
    y: 320,
    con: [["out", 0]],
  },
  Oscillator: {
    x: 160,
    y: 320,
    con: [
      ["out", 0],
      ["mod", 1],
    ],
  },
  Oscilloscope: {
    x: 160,
    y: 320,
    con: [["in", 0]],
  },
  Trigger: {
    x: 320,
    y: 160,
    con: [["triggerout", 0]],
  },
};
