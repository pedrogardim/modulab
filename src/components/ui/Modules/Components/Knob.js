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
  const [angle, setAngle] = useState(
    ((props.defaultValue - props.min) / (props.max - props.min)) *
      (135 - -135) -
      135
  );

  const handleKnobMove = (e) => {
    let centerPosition = [
      knobRef.current.getBoundingClientRect().left +
        knobRef.current.getBoundingClientRect().width / 2,
      knobRef.current.getBoundingClientRect().top +
        knobRef.current.getBoundingClientRect().height / 2,
    ];
    let deltaXY = [
      props.mousePosition[0] - centerPosition[0],
      centerPosition[1] - props.mousePosition[1],
    ];

    let angle = (Math.atan2(...deltaXY) * 180) / Math.PI;

    angle = angle >= 135 ? 135 : angle < -135 ? -135 : angle;

    setAngle(Math.floor(angle));

    let value =
      ((angle - -135) / (135 - -135)) * (props.max - props.min) + props.min;

    value = props.logScale
      ? props.min === 0
        ? linearToLogScale(value, props.min + 1, props.max + 1) - 1
        : linearToLogScale(value, props.min, props.max)
      : value;

    value =
      typeof props.step === "number"
        ? Math.round(value / props.step) * props.step
        : value;

    setValue(value);
  };

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  useEffect(() => {
    !props.mousePosition && setOpen(false);
    props.mousePosition && open && handleKnobMove();
  }, [props.mousePosition]);

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
        <div className="knob-value-label">
          {value.toString().split(".")[1] &&
          value.toString().split(".")[1].length > 2
            ? value.toFixed(2)
            : value}
        </div>
      )}
      <div
        className="knob-mark-cont"
        style={{
          transform: `rotate(${angle}deg)`,
        }}
      >
        <div />
      </div>
      <span className="module-jack-lbl">{props.label && props.label}</span>
    </Paper>
  );
}

export default Knob;

const linearToLogScale = (value, min, max) => {
  let b = Math.log(max / min) / (max - min);
  let a = max / Math.exp(b * max);
  let tempAnswer = a * Math.exp(b * value);

  return tempAnswer;
};

//var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
