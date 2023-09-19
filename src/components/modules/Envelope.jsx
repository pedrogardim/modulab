import { useState } from "react";
import * as Tone from "tone";

import { Jack } from "../ui/Jack";
import { Knob } from "../ui/Knob";
let triggered = false;

function Envelope(props) {
  const {
    setModules,
    index,
    nodes,
    module,
    mousePosition,
    setDrawingLine,
    drawingLine,
    connections,
    setNodes,
  } = props;

  const [eventId, setEventId] = useState(null);

  const updateCurve = (curve) => {
    var canvas = document.getElementById(`envelope-canvas-${module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    //find first phase

    ctx.strokeStyle = "#3f51b5";
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);

    curve.map((e, i) =>
      ctx.lineTo(i + 1, canvasHeight - e * canvasHeight, 1, 1)
    );

    ctx.stroke();
  };

  const triggerOn = () => {
    console.log("triggerOnEnv");
  };

  const triggerOff = () => {
    console.log("triggerOffEnv");
  };

  // useEffect(() => {
  //   nodes[0].asArray(144).then((r) => updateCurve(r));
  // }, [nodes[0].attack, nodes[0].decay, nodes[0].sustain, nodes[0].release]);

  // useEffect(() => {
  //   const context = Tone.getContext().rawContext;
  //   class TriggerDetectorNode extends AudioWorkletNode {
  //     constructor(actx, options) {
  //       super(actx, "TriggerDetector", {
  //         numberOfInputs: 1,
  //         numberOfOutputs: 1,
  //         channelCount: 1,
  //         parameterData: options,
  //       });
  //       this.attack = this.parameters.get("attack");
  //       this.attackcurve = this.parameters.get("attackcurve");
  //       this.decay = this.parameters.get("decay");
  //       this.sustain = this.parameters.get("sustain");
  //       this.release = this.parameters.get("release");
  //     }
  //   }
  //   context.audioWorklet
  //     .addModule("worklet/triggerDetector.js")
  //     .then(() => {
  //       let node = new TriggerDetectorNode(context, {
  //         //processorOptions: { env: nodes[0] },
  //       });
  //       console.log(node);
  //       setNodes((prev) => {
  //         let newNodes = { ...prev };
  //         newNodes[module.id][0] = node;
  //         return newNodes;
  //       });
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

  //console.log(nodes[1].getValue());

  return (
    <>
      <canvas
        height={96}
        width={144}
        id={"envelope-canvas-" + module.id}
        style={{ pointerEvents: "none", imageRendering: "pixelated" }}
      />

      <div className="break" />

      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={module.p.a}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0] && nodes[0].attack.setValueAtTime(v, Tone.now());
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.a = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={5}
        defaultValue={module.p.d}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0] && nodes[0].decay.setValueAtTime(v, Tone.now());
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.d = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.s}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0] && nodes[0].sustain.setValueAtTime(v, Tone.now());
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.s = v;
            return newModules;
          });
        }}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={module.p.r}
        mousePosition={mousePosition}
        onChange={(v) => {
          nodes[0] && nodes[0].release.setValueAtTime(v, Tone.now());
        }}
        onChangeCommitted={(v) => {
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.r = v;
            return newModules;
          });
        }}
      />

      <div className="break" />

      <button
        onMouseDown={() => nodes[0].triggerAttack()}
        onMouseUp={() => nodes[0].triggerRelease()}
      >
        Trigger
      </button>
      <div className="break" />

      {/* <Jack
        type="in"
        index={0}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      /> */}

      <Jack
        type="in"
        label="Trigger"
        index={1}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      />

      <Jack
        type="out"
        index={0}
        module={module}
        setDrawingLine={setDrawingLine}
        drawingLine={drawingLine}
      />
    </>
  );
}

export default Envelope;
