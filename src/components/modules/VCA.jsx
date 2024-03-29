import { Jack } from "../ui/Jack";
import { Knob } from "../ui/Knob";

function VCA({
  setModules,
  index,
  module,
  setDrawingLine,
  drawingLine,
  nodes,
  mousePosition,
}) {
  return (
    <>
      <Jack type="in" label="In" index={0} module={module} />
      <Knob
        label={"Gain"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.v}
        onChange={(v) => {
          nodes[0].set({ gain: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.v = v;
            return newModules;
          })
        }
        mousePosition={mousePosition}
      />
      <Jack type="mod" label="mod" index={2} module={module} />
      <Knob
        label={"CV"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.md}
        onChange={(v) => {
          nodes[1].set({ gain: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.md = v;
            return newModules;
          })
        }
        mousePosition={mousePosition}
      />
      <Jack type="out" label="out" index={1} module={module} />
    </>
  );
}

export default VCA;
