import { useState } from "react";

import { Jack } from "../ui/Jack";
import { Knob } from "../ui/Knob";

function ChMixer(props) {
  const { setModules, module, nodes, index } = props;
  const [mixerParams, setMixerParams] = useState(
    [1, 2, 3, 4, 0].map((e) => ({
      muted: module.p[e].m,
      volume: module.p[e].v,
      pan: module.p[e].p,
      id: e,
    }))
  );
  return (
    <>
      {mixerParams.map((e, i) => (
        <input
          type="range"
          style={{
            height: 150,
            filter: e.muted && "saturate(0)",
            pointerEvents: e.muted && "none",
          }}
          orientation="vertical"
          value={parseInt(e.volume)}
          onInput={(_, v) => {
            //TODO fix event
            setMixerParams((prev) => {
              let par = [...prev];
              par[i].volume = v;
              return par;
            });
            nodes[e.id].volume.value = v;
          }}
          onChange={(_, v) => {
            //TODO fix event
            setModules((prev) => {
              let newModules = [...prev];
              newModules[index].p[e.id].v = v;
              return newModules;
            });
          }}
          color={e === 0 ? "secondary" : "primary"}
          min={-61}
          max={12}
          valueLabelDisplay="auto"
        />
      ))}
      <div className="break" style={{ height: 8 }} />

      {mixerParams.map((e, i) => (
        <Knob
          mousePosition={props.mousePosition}
          type={e === 0 ? "out" : "in"}
          step={0.05}
          min={-1}
          max={1}
          defaultValue={e.pan}
          size={24}
          onChange={(v) => {
            setMixerParams((prev) => {
              let par = [...prev];
              par[i].pan = v;
              return par;
            });
            nodes[e.id].pan.value = v;
          }}
          onChangeCommitted={(v) => {
            setModules((prev) => {
              let newModules = [...prev];
              newModules[index].p[e.id].p = v;
              return newModules;
            });
          }}
        />
      ))}

      <div className="break" style={{ height: 0 }} />

      {mixerParams.map((e, i) => (
        <button
          onClick={() => {
            setMixerParams((prev) => {
              let par = [...prev];
              par[i].muted = !par[i].muted;
              nodes[e.id].mute = par[i].muted;
              return par;
            });
            setModules((prev) => {
              let newModules = [...prev];
              newModules[index].p[e.id].m = !newModules[index].p[e.id].m;
              return newModules;
            });
          }}
          color={mixerParams[i].muted ? "secondary" : "primary"}
        >
          M
        </button>
      ))}

      <div className="break" style={{ height: 0 }} />

      {[1, 2, 3, 4, 0].map((e, i) => (
        <Jack
          type={e === 0 ? "out" : "in"}
          index={i}
          module={module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />
      ))}
      <div className="break" style={{ height: 32 }} />
    </>
  );
}

export default ChMixer;
