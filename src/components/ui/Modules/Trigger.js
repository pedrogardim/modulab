import React, { useState, useEffect, Fragment, useRef } from "react";
import * as Tone from "tone";

import { useTranslation } from "react-i18next";

import { Card, Icon, IconButton, Button } from "@material-ui/core";

import Draggable from "react-draggable";
import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function Trigger(props) {
  const { t } = useTranslation();

  const [LEDLvl, setLEDLvl] = useState(0);
  const [clocktime, setClocktime] = useState(1);
  const [holdTime, setHoldTime] = useState(0.5);

  const [eventSchedule, setEventSchedule] = useState(null);

  const [state, setState] = useState(false);

  const triggerOn = (time) => {
    /* time !== undefined
      ? props.nodes[0].setValueAtTime(1, time)
      : (props.nodes[0].value = 1); */
    Tone.Draw.schedule(() => {
      setLEDLvl(1);
    }, time);

    props.nodes
      .filter((e, i) => i > 0)
      .map((e) => e.triggerAttack(time ? time : 0));
  };

  const triggerOff = (time) => {
    /* time !== undefined
      ? props.nodes[0].setValueAtTime(0, time)
      : (props.nodes[0].value = 0); */
    Tone.Draw.schedule(() => {
      setLEDLvl(0);
    }, time);
    props.nodes
      .filter((e, i) => i > 0)
      .map((e) => e.triggerRelease(time ? time : 0));
  };

  /* useEffect(() => {
    setInterval(() => setLEDLvl(props.nodes[0].value), 1);
  }, []); */

  //useEffect(() => {}, [props.nodes[0].value]);

  useEffect(() => {
    if (eventSchedule !== null) {
      console.log("cleared", eventSchedule);
      Tone.Transport.clear(eventSchedule);
    }

    let eventId = Tone.Transport.scheduleRepeat((time) => {
      triggerOn(time);
      triggerOff(time + clocktime * holdTime);
    }, clocktime);

    setEventSchedule(eventId);
  }, [clocktime, holdTime]);

  return (
    <>
      <div
        style={{
          backgroundColor: "red",
          filter: `brightness(${LEDLvl})`,
          position: "absolute",
          height: 16,
          width: 16,
          top: 8,
          left: 8,
          borderRadius: "100%",
        }}
      ></div>
      <Knob
        size={48}
        min={0.5}
        step={0.05}
        max={10}
        defaultValue={clocktime}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          setClocktime(1 / v);
        }}
      />
      <Knob
        hideValue
        size={32}
        min={0.01}
        step={0.01}
        max={0.99}
        defaultValue={holdTime}
        mousePosition={props.mousePosition}
        onChange={(v) => {
          setHoldTime(v);
        }}
      />

      <Jack
        type="triggerout"
        label="Tr"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />

      <div width="30px" />

      <div className="break" />

      <Button
        onMouseDown={() => triggerOn(Tone.now())}
        onMouseUp={() => triggerOff()}
        variant="outlined"
        color="primary"
      >
        Trigger
      </Button>
      <Button
        onClick={() => {
          Tone.Transport.toggle();
          setState((prev) => !prev);
        }}
        variant={state ? "contained" : "outlined"}
        color="primary"
      >
        {state ? "Stop" : "Start"}
      </Button>
    </>
  );
}

export default Trigger;
