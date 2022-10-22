import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Select, Button, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";

import Jack from "./Components/Jack";
import Knob from "./Components/Knob";

function SeqP16(props) {
  const { module, nodes, setModules, index } = props;

  const [steps, setSteps] = useState(module.p.steps);
  const [pitches, setPitches] = useState(module.p.p);
  const [eventId, setEventId] = useState(null);
  const [stepTime, setStepTime] = useState("16n");
  const [currentStep, setCurrentStep] = useState(0);
  const [pitchMode, setPitchMode] = useState(module.p.m);

  const toggleStep = (index) => {
    setSteps((prev) => {
      let newSteps = [...prev];
      newSteps[index] = !newSteps[index];
      return newSteps;
    });
  };

  const triggerOn = (time, pitch) => {
    nodes[0] && nodes[0].setValueAtTime(1, time);

    nodes[1] &&
      nodes[1].setValueAtTime(
        Tone.Frequency(pitch, "midi").toFrequency(),
        time
      );
  };

  const triggerOff = (time) => {
    nodes[0] && nodes[0].setValueAtTime(0, time);
  };

  useEffect(() => {
    eventId !== null && Tone.Transport.clear(eventId);

    let id = Tone.Transport.scheduleRepeat((time) => {
      steps.map((step, stepIndex) => {
        let t = time + Tone.Time(stepTime).toSeconds() * stepIndex;
        if (step) {
          triggerOn(t, pitches[stepIndex]);
          triggerOff(t + Tone.Time(stepTime).toSeconds() / 2);
        }
        Tone.Draw.schedule(() => {
          setCurrentStep(stepIndex);
        }, t);
      });
    }, Tone.Time(stepTime).toSeconds() * 16);

    setEventId(id);

    setModules((prev) => {
      let newModules = [...prev];
      newModules[index].p.steps = [...steps];
      newModules[index].p.p = [...pitches];
      return newModules;
    });
  }, [steps, pitches]);

  useEffect(() => {
    setModules((prev) => {
      let newModules = [...prev];
      newModules[index].p.m = pitchMode;
      return newModules;
    });
  }, [pitchMode]);

  return (
    <>
      <div
        style={{
          width: "90%",
          height: 32,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {Array(16)
          .fill(1)
          .map((_, i) => (
            <div
              style={{
                flex: "1 1 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                border: "solid 1px #5A5A5A",
                borderRadius: 4,
                margin: 1,
                background:
                  Tone.Transport.state === "started" && currentStep === i
                    ? "#f55d42"
                    : steps[i]
                    ? "#3CE02B"
                    : "transparent",
              }}
              onClick={() => toggleStep(i)}
            >
              {pitchMode && steps[i] && (
                <>
                  <Icon
                    style={{ position: "absolute", top: -20, color: "#5A5A5A" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPitches((prev) => {
                        let newPitches = [...prev];
                        newPitches[i]++;
                        return newPitches;
                      });
                    }}
                  >
                    expand_less
                  </Icon>
                  <Icon
                    style={{
                      position: "absolute",
                      bottom: -20,
                      color: "#5A5A5A",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPitches((prev) => {
                        let newPitches = [...prev];
                        newPitches[i]--;
                        return newPitches;
                      });
                    }}
                  >
                    expand_more
                  </Icon>

                  <span>{Tone.Frequency(pitches[i], "midi").toNote()}</span>
                </>
              )}
            </div>
          ))}
      </div>

      <div className="break" />

      <IconButton
        onClick={() =>
          Tone.Transport.state === "started"
            ? Tone.Transport.stop()
            : Tone.Transport.start()
        }
      >
        <Icon>
          {Tone.Transport.state === "started" ? "stop" : "play_arrow"}
        </Icon>
      </IconButton>
      <IconButton onClick={() => setPitchMode((prev) => !prev)}>
        <Icon>music_note</Icon>
      </IconButton>

      <Jack
        type="out"
        label="trigger"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Jack
        type="out"
        label="pitch"
        index={1}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default SeqP16;
