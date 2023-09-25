import { useEffect } from "react";
import * as Tone from "tone";

import { Jack } from "../ui/Jack";
import { Knob } from "../ui/Knob";

import { drawADSR } from "@/utils/envelopeUtils";
import { useDispatch, useSelector } from "@/store/hooks";
import { updateModuleParams } from "@/store/sessionSlice";

function Envelope({ index, nodes }) {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.session);
  const module = modules[index];

  const updateParam = (key, value) => {
    dispatch(
      updateModuleParams({
        moduleIndex: index,
        newModuleParams: { [key]: value },
      })
    );
  };

  useEffect(() => {
    drawADSR(
      document.getElementById(`envelope-canvas-${module.id}`),
      module.p.a,
      module.p.d,
      module.p.s,
      (module.p.a + module.p.d + module.p.r) / 3,
      module.p.r
    );
  }, [module]);

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
        onChange={(v) => {
          nodes[0] && nodes[0].attack.setValueAtTime(v, Tone.now());
        }}
        onChangeCommited={(v) => updateParam("a", v)}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={5}
        defaultValue={module.p.d}
        onChange={(v) => {
          nodes[0] && nodes[0].decay.setValueAtTime(v, Tone.now());
        }}
        onChangeCommited={(v) => updateParam("d", v)}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.s}
        onChange={(v) => {
          nodes[0] && nodes[0].sustain.setValueAtTime(v, Tone.now());
        }}
        onChangeCommited={(v) => updateParam("s", v)}
      />
      <Knob
        size={36}
        min={0}
        step={0.01}
        max={10}
        defaultValue={module.p.r}
        onChange={(v) => {
          nodes[0] && nodes[0].release.setValueAtTime(v, Tone.now());
        }}
        onChangeCommited={(v) => updateParam("r", v)}
      />

      <div className="break" />

      <button
        onMouseDown={() => nodes[0].trigger.setValueAtTime(1, Tone.now())}
        onMouseUp={() => nodes[0].trigger.setValueAtTime(0, Tone.now())}
        onMouseLeave={() => nodes[0].trigger.setValueAtTime(0, Tone.now())}
      >
        Trigger
      </button>
      <div className="break" />

      <Jack type="in" label="Trigger" index={1} module={module} />

      <Jack type="out" index={0} module={module} />
    </>
  );
}

export default Envelope;
