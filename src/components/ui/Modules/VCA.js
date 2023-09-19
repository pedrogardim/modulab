import Jack from "./Components/Jack";
import { Knob } from "../input";

function VCA({ setModules, index, module }) {
  return (
    <>
      <Jack
        type="in"
        label="In"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Knob
        label={"Gain"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.v}
        onChange={(v) => {
          props.nodes[0].set({ gain: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.v = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <Jack
        type="mod"
        label="mod"
        index={2}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Knob
        label={"CV"}
        size={36}
        min={0}
        step={0.01}
        max={1}
        defaultValue={module.p.md}
        onChange={(v) => {
          props.nodes[1].set({ gain: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.md = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <Jack
        type="out"
        label="out"
        index={1}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default VCA;
