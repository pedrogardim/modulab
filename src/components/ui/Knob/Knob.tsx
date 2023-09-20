import React, { useState, useEffect, useRef, FC } from "react";
import { createPortal } from "react-dom";

import { KnobProps } from "./Knob.types";

import "./Knob.css";

const Knob: FC<KnobProps> = ({
  defaultValue = 0.5,
  polar = false,
  size = 32,
  min = 0,
  max = 1,
  logScale = false,
  step = 0.01,
  onChange = () => {},
  onChangeCommited = () => {},
  color = "#3f51b5",
  disabled,
  style,
  label,
  showValue = true,
}) => {
  const knobRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [input, setInput] = useState(false);

  const [value, setValue] = useState(defaultValue);
  const [valueAtClick, setValueAtClick] = useState(0);

  const [angle, setAngle] = useState(
    ((defaultValue - min) / (max - min)) * (135 - -135) - 135
  );

  const handleKnobMove = (cursorX: number, cursorY: number) => {
    const { getBoundingClientRect } = knobRef.current as any;
    let centerPosition = [
      getBoundingClientRect().left + getBoundingClientRect().width / 2,
      getBoundingClientRect().top + getBoundingClientRect().height / 2,
    ];
    let deltaXY: number[] = [
      cursorX - centerPosition[0],
      centerPosition[1] - cursorY,
    ];

    if (
      polar &&
      Math.abs(deltaXY[0]) < size / 2 &&
      Math.abs(deltaXY[1]) < size / 2
    )
      return;

    if (polar) {
      let angle = (Math.atan2(deltaXY[1], deltaXY[0]) * 180) / Math.PI;

      angle = angle >= 135 ? 135 : angle < -135 ? -135 : angle;

      setAngle(Math.floor(angle));

      let value = ((angle - -135) / (135 - -135)) * (max - min) + min;

      value = logScale
        ? min === 0
          ? linearToLogScale(value, min + 1, max + 1) - 1
          : linearToLogScale(value, min, max)
        : value;

      value =
        typeof step === "number" ? Math.round(value / step) * step : value;

      setValue(value);
    } else {
      let valueDelta = (deltaXY[1] / (window.innerHeight / 2)) * (max - min);

      let value = valueAtClick + valueDelta;

      value = value < min ? min : value > max ? max : value;

      value = logScale
        ? min === 0
          ? linearToLogScale(value, min + 1, max + 1) - 0.5
          : linearToLogScale(value, min, max)
        : value;

      value =
        typeof step === "number" ? Math.round(value / step) * step : value;

      setValue(value);
    }
  };

  const handleValueInput = (v: number) => {
    //let val = v;
    let val = v < min ? min : v > max ? max : v;

    setValue(val);

    let angle = ((val - min) / (max - min)) * (135 - -135) + -135;

    //angle = logScale ? logToLinearScale(val, -135, 135) : angle;

    setAngle(Math.floor(angle));
    setOpen(false);
  };

  useEffect(() => {
    if (typeof value === "number") onChange(value);
    if (!polar) setAngle(((value - min) / (max - min)) * (135 - -135) - 135);
  }, [value]);

  useEffect(() => {
    if (!polar) setValueAtClick(value);
    if (!open && typeof value === "number" && onChangeCommited)
      onChangeCommited(value);
  }, [open]);

  return (
    <>
      <div
        className="knob track-knob"
        style={{
          height: size,
          width: size,
          backgroundColor: color,
          filter: `saturate(${disabled ? 0 : 1})`,
          pointerEvents: disabled ? "none" : "auto",
          ...style,
        }}
        onMouseDown={() => setOpen(true)}
        onClick={(e) => e.detail === 2 && setInput(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        //
        onTouchStart={() => setOpen(true)}
        onTouchEnd={(e) => setOpen(false)}
        onTouchMove={(e) =>
          handleKnobMove(e.touches[0].pageX, e.touches[0].pageY)
        }
        ref={knobRef}
      >
        {(open || hovered) && showValue && (
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

        {input && (
          <input
            autoFocus
            style={{
              position: "absolute",
              minWidth: "100%",
              top: 0,
              outline: "black",
              textAlign: "center",
            }}
            defaultValue={value}
            type="number"
            min={min}
            max={max}
            step={step}
            onBlur={(e) => {
              handleValueInput(parseFloat(e.target.value));
              setInput(false);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                // handleValueInput(parseFloat(e.target.value));
                setInput(false);
              }
            }}
          />
        )}
        <span color="textPrimary" className="knob-lbl">
          {label && label}
        </span>
      </div>
      {open &&
        createPortal(
          <div
            className="knob-backdrop"
            onMouseMove={(e) => handleKnobMove(e.pageX, e.pageY)}
            onMouseUp={() => setOpen(false)}
            onMouseOut={() => setOpen(false)}
            onClick={(e) => setInput(true)}
          />,
          document.body
        )}
    </>
  );
};

export default Knob;

const linearToLogScale = (value: number, min: number, max: number) => {
  let b = Math.log(max / min) / (max - min);
  let a = max / Math.exp(b * max);
  let tempAnswer = a * Math.exp(b * value);

  return tempAnswer;
};

//var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
