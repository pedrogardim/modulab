import React, { useState, useEffect, Fragment, useRef } from "react";

import { useTranslation } from "react-i18next";
import LeaderLine from "leader-line-new";

import { Paper, Slider } from "@material-ui/core";

import "./Knob.css";

function Knob(props) {
  const { t } = useTranslation();
  const knobRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <Paper
      className="module-knob"
      style={{
        height: props.size,
        width: props.size,
        backgroundColor: props.color ? props.color : "#3f51b5",
      }}
      onMouseDown={() => setOpen(true)}
      ref={knobRef}
    >
      {open && (
        <Paper
          className="hidden-slider-cont"
          style={{
            width: props.exp ? 512 : 256,
            left: (props.exp ? -256 : -128) + props.size / 2,
          }}
          onMouseLeave={() => setOpen(false)}
        >
          <Slider
            autoFocus
            valueLabelDisplay="on"
            value={value}
            onChange={(e, v) => setValue(v)}
            min={props.min}
            max={props.max}
            step={props.step}
            scale={props.scale}
          />
        </Paper>
      )}
      <div
        className="knob-mark-cont"
        style={{
          transform: `rotate(${
            ((value - props.min) / (props.max + 135)) * (135 + 135) - 135
          }deg)`,
        }}
      >
        <div />
      </div>
    </Paper>
  );
}

export default Knob;
