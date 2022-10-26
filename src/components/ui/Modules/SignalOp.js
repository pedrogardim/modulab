import React, { useState, useEffect } from "react";
import Jack from "./Components/Jack";
import * as Tone from "tone";

import { Select, TextField } from "@material-ui/core";

function Meter(props) {
  const { module, index, setModules, nodes } = props;
  const [operation, setOperation] = useState(module.p.op);
  const [value, setValue] = useState(module.p.v);
  const [opNode, setOpNode] = useState(null);

  useEffect(() => {
    console.log(nodes);
    nodes[0].disconnect(opNode);
    const nodeTypes = [Tone.Add, Tone.Subtract, Tone.Multiply, Tone.Multiply];
    const node = new nodeTypes[operation](operation === 3 ? 1 / value : value);
    opNode && opNode.dispose();
    nodes[0].connect(node);
    node.connect(nodes[1]);
    setOpNode(node);
  }, [operation]);

  return (
    <>
      <Jack
        type="in"
        label="in"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />

      <Select
        native
        style={{ width: 50 }}
        onChange={(e) => {
          setOperation(parseInt(e.target.value));
          setModules((prev) => {
            let newModules = [...prev];
            newModules[index].p.op = parseInt(e.target.value);
            return newModules;
          });
        }}
        value={operation}
      >
        {["+", "-", "x", "÷"].map((e, i) => (
          <option value={i}>{e}</option>
        ))}
      </Select>

      <TextField
        style={{ width: 70 }}
        className="text-input"
        value={value}
        onChange={(e) => {
          if (e.target.value === null) return;
          opNode.setValueAtTime(
            operation === 3 ? 1 / e.target.value : e.target.value,
            Tone.now()
          );
          setValue(e.target.value);
        }}
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

export default Meter;
