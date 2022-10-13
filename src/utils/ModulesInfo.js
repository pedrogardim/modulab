export const modulesInfo = {
  Analyzer: {
    x: 512,
    y: 320,
    con: [["in", 0]],
    defaultParam: {},
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
  },
  Envelope: {
    x: 192,
    y: 320,
    con: [
      ["in", 0],
      ["trigger", 0],
      ["out", 0],
    ],
    defaultParam: { a: 0.01, d: 0.1, s: 0.5, r: 0.1 },
  },
  Filter: {
    x: 128,
    y: 320,
    con: [
      ["in", 0],
      ["out", 0],
    ],
    defaultParam: { f: 500, q: 1, t: 0 },
  },
  LFO: {
    x: 128,
    y: 320,
    con: [["out", 0]],
    defaultParam: { f: 1, t: 0 },
  },
  MasterOut: {
    x: 128,
    y: 128,
    closeBtn: false,
    con: [["in", 0]],
    defaultParam: {},
  },
  NoiseGenerator: {
    x: 128,
    y: 320,
    con: [["out", 0]],
    defaultParam: { r: 1, t: 0 },
  },
  Oscillator: {
    x: 128,
    y: 320,
    con: [
      ["mod", 1],
      ["pitch", 0],
      ["out", 0],
    ],
    defaultParam: { f: 440, wt: 0, md: 0 },
  },
  Oscilloscope: {
    x: 512,
    y: 320,
    con: [["in", 0]],
    defaultParam: {},
  },
  SeqP16: {
    x: 512,
    y: 96,
    con: [
      ["triggerout", 0],
      ["pitchout", 0],
    ],
    defaultParam: {
      steps: new Array(16).fill(false),
      p: new Array(16).fill(60),
      m: false,
    },
  },
  Trigger: {
    x: 320,
    y: 64,
    con: [["triggerout", 0]],
  },
};
