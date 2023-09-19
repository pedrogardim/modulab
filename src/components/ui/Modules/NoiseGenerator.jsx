import Jack from "./Components/Jack";
import { Knob } from "../input";
function NoiseGenerator(props) {
  const { index, module, setModules } = props;
  return (
    <>
      {/* <Knob
        exp
        size={64}
        min={0}
        step={0.1}
        max={5}
        defaultValue={props.nodes[0].playbackRate}
        onChange={(v) => {
          props.nodes[0].playbackRate = v;
        }}
        color="lightgray"
        mousePosition={props.mousePosition}
      />
      <div className="break" /> */}
      <select
        onChange={(e) => {
          props.nodes[0].set({
            type: ["white", "brown", "pink"][parseInt(e.target.value)],
          });
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.t = parseInt(e.target.value);
            return newModules;
          });
        }}
        defaultValue={module.p.t}
      >
        {["white", "brown", "pink"].map((e, i) => (
          <option value={i}>{e}</option>
        ))}
      </select>
      <div className="break" />

      <Jack
        type="out"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      {/* <Jack
          type="mod"
          index={1}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        /> */}
    </>
  );
}

export default NoiseGenerator;
