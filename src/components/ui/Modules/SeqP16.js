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
  const [steps, setSteps] = useState(Array(16).fill(false));
  const [pitches, setPitches] = useState(Array(16).fill(60));
  const [eventId, setEventId] = useState(null);
  const [stepTime, setStepTime] = useState("16n");
  const [currentStep, setCurrentStep] = useState(0);
  const [pitchMode, setPitchMode] = useState(false);

  const toggleStep = (index) => {
    setSteps((prev) => {
      let newSteps = [...prev];
      newSteps[index] = !newSteps[index];
      return newSteps;
    });
  };

  const triggerOn = (time, pitch) => {
    if (props.nodes) {
      props.nodes[0] &&
        props.nodes[0].map((e) => e.triggerAttack(time ? time : 0));
      props.nodes[1] &&
        props.nodes[1].map((e) =>
          e.frequency.setValueAtTime(Tone.Frequency(pitch, "midi"), time)
        );
    }
  };

  const triggerOff = (time) => {
    props.nodes &&
      props.nodes[0] &&
      props.nodes[0].map((e) => e.triggerRelease(time ? time : 0));
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

    console.log(steps, props.nodes);
  }, [steps, pitches]);

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
        type="triggerout"
        label="tr"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
      <Jack
        type="pitchout"
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
