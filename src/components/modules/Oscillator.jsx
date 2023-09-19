import { Jack } from "../ui/Jack";
import { Knob } from "../ui/Knob";
function Oscillator(props) {
  const { index, module, setModules } = props;
  return (
    <>
      <Knob
        exp
        logScale
        size={64}
        min={0}
        step={1}
        max={20000}
        defaultValue={module.p.f}
        onChange={(v) => {
          props.nodes[0].set({ frequency: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.f = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <div className="break" />
      <Knob
        exp
        logScale
        size={32}
        min={-2400}
        step={1}
        max={2400}
        defaultValue={module.p.d}
        onChange={(v) => {
          props.nodes[0].set({ detune: v });
        }}
        onChangeCommitted={(v) =>
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.d = v;
            return newModules;
          })
        }
        mousePosition={props.mousePosition}
      />
      <div className="break" />
      <select
        onChange={(e) => {
          props.nodes[0].set({
            type: ["sine", "square", "sawtooth", "triangle"][
              parseInt(e.target.value)
            ],
          });
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.t = parseInt(e.target.value);
            return newModules;
          });
        }}
        defaultValue={module.p.t}
      >
        {["sine", "square", "sawtooth", "triangle"].map((e, i) => (
          <option value={i}>{e}</option>
        ))}
      </select>
      <div className="break" />

      <Jack
        label="CV"
        type="mod"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      {/* 
      <Knob
        hideValue
        label={"Mod Depth"}
        size={36}
        min={0}
        step={1}
        max={20000}
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
        type="pitch"
        index={1}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      /> */}

      <Jack
        type="out"
        index={2}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default Oscillator;
