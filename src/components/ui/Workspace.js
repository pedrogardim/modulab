import React, { useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import LeaderLine from "leader-line-new";

import { useParams } from "react-router-dom";

import {
  Fab,
  Icon,
  IconButton,
  Typography,
  Tooltip,
  Snackbar,
  Menu,
  MenuItem,
  Paper,
  Fade,
} from "@material-ui/core";

import LoadingScreen from "./LoadingScreen";

import Oscillator from "./Modules/Oscillator";
import NoiseGenerator from "./Modules/NoiseGenerator";

import MasterOut from "./Modules/MasterOut";
import LFO from "./Modules/LFO";
import Filter from "./Modules/Filter";
import Envelope from "./Modules/Envelope";
import ChMixer from "./Modules/ChMixer";
import Oscilloscope from "./Modules/Oscilloscope";
import Analyzer from "./Modules/Analyzer";

import ActionConfirm from "./Dialogs/ActionConfirm";

import "./Workspace.css";

function Workspace(props) {
  const { t } = useTranslation();

  const [mousePosition, setMousePosition] = useState([]);

  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState({});

  const [connections, setConnections] = useState([]);
  const [connectionAnimator, setConnectionAnimator] = useState(null);

  const [recorder, setRecorder] = useState(new Tone.Recorder());

  const [modulePicker, setModulePicker] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [sessionHistory, setSessionHistory] = useState({
    past: [],
    present: null, // (?) How do we initialize the present?
    future: [],
  });

  const [drawingLine, setDrawingLine] = useState(null);

  const [optionsMenu, setOptionsMenu] = useState(false);

  const sessionKey = useParams().key;
  const autoSaverTime = 5 * 60 * 1000; //5min

  const addModule = (type) => {
    let moduleId = !modules.length
      ? 0
      : Math.max(...modules.map((e) => e.id)) + 1;
    let newModule = {
      id: moduleId,
      type: type,
    };
    setModules((prev) => [...prev, newModule]);

    let nodes;
    if (type === "MasterOut") {
      let limiter = new Tone.Limiter(0).connect(recorder).toDestination();
      nodes = [limiter];
    } else if (type === "Oscillator") {
      let osc = new Tone.Oscillator({
        frequency: 400,
        type: "sine",
        volume: -6,
      }).start();
      let modGain = new Tone.Gain(0).connect(osc.frequency);
      nodes = [osc, modGain];
    } else if (type === "NoiseGenerator") {
      let noise = new Tone.Noise("white").start();
      nodes = [noise];
    } else if (type === "LFO") {
      let meter = new Tone.Meter();

      let lfo = new Tone.LFO({
        frequency: 1,
        type: "sine",
        min: 0,
        max: 1,
        amplitude: 1,
      })
        .start()
        .connect(meter);
      nodes = [lfo, meter];
    } else if (type === "Oscilloscope") {
      let meter = new Tone.Waveform(1024);
      nodes = [meter];
    } else if (type === "Analyzer") {
      let meter = new Tone.FFT(512);
      nodes = [meter];
    } else if (type === "Filter") {
      let gain = new Tone.Limiter(0);
      let filter = new Tone.Filter().connect(gain);
      nodes = [filter, gain];
    } else if (type === "Envelope") {
      let gain = new Tone.Gain();
      let envelope = new Tone.AmplitudeEnvelope().connect(gain);
      let triggerMeter = new Tone.Meter();
      nodes = [envelope, gain, triggerMeter];
    } else if (type === "ChMixer") {
      let master = new Tone.Channel(-12);
      let ch1 = new Tone.Channel(0).connect(master);
      let ch2 = new Tone.Channel(0).connect(master);
      let ch3 = new Tone.Channel(0).connect(master);
      let ch4 = new Tone.Channel(0).connect(master);

      nodes = [master, ch1, ch2, ch3, ch4];
    }

    setNodes((prev) => {
      let newNodes = { ...prev };
      newNodes[moduleId] = nodes;
      return newNodes;
    });
  };

  const removeModule = (id) => {
    connections.forEach(
      (e) => (e.module === id || e.target.module === id) && e.line.remove()
    );
    setConnections((prev) =>
      prev.filter((e) => e.module !== id && e.target.module !== id)
    );
    nodes[id].forEach((e) => e.dispose());
    setModules((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConnect = (connection) => {
    const drawLine = () =>
      setConnections((prev) => [
        ...prev,
        {
          ...connection,
          line: new LeaderLine(
            document.getElementById(
              `jack-${connection.module}-${connection.index}`
            ).children[0],
            document.getElementById(
              `jack-${connection.target.module}-${connection.target.index}`
            ).children[0],
            {
              startPlug: "disc",
              endPlug: "disc",
              startSocketGravity: [0, 200],
              endSocketGravity: [0, 200],
            }
          ),
        },
      ]);

    if (connection.type === "out" && connection.target.type === "in") {
      nodes[connection.module][connection.index].connect(
        nodes[connection.target.module][connection.target.index]
      );
      drawLine();
    }
    if (connection.type === "in" && connection.target.type === "out") {
      nodes[connection.target.module][connection.target.index].connect(
        nodes[connection.module][connection.index]
      );
      drawLine();
    }

    if (connection.type === "out" && connection.target.type === "mod") {
      nodes[connection.module][connection.index].connect(
        nodes[connection.target.module][connection.target.index]
      );
      drawLine();
    }
    if (connection.type === "mod" && connection.target.type === "out") {
      nodes[connection.target.module][connection.target.index].connect(
        nodes[connection.module][connection.index]
      );
      drawLine();
    }
  };

  const removeConnection = (connection) => {};

  const startRecording = () => {
    recorder.start();
  };

  const stopRecording = async () => {
    const recording = await recorder.stop();
    // download the recording by creating an anchor element and blob url
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = "recording.webm";
    anchor.href = url;
    anchor.click();
  };

  const handleUndo = (action) => {
    let currentModules = deepCopy(modules);

    setSessionHistory((prev) => {
      let { past, present, future } = { ...prev };

      let cleanHistory = {
        past: [],
        present: currentModules, // (?) How do we initialize the present?
        future: [],
      };

      switch (action) {
        case "UNDO":
          if (past.length < 1) return prev;
          let previous = past[past.length - 1];
          let newPast = past.slice(0, past.length - 1);
          setModules(deepCopy(previous));
          return {
            past: newPast,
            present: previous,
            future: [present, ...future],
          };

        case "REDO":
          if (future.length < 1) return prev;
          let next = future[0];
          let newFuture = future.slice(1);
          setModules(deepCopy(next));
          return {
            past: [...past, present],
            present: next,
            future: newFuture,
          };
        case "RESET":
          return cleanHistory;
        default:
          let areDifferent =
            JSON.stringify(present) !== JSON.stringify(currentModules);

          //TEMP Solution: (currentModules.length < past[past.length - 1].length) ===> Reset undo to prevent bringing back deleted modules

          return past[past.length - 1] &&
            currentModules.length < past[past.length - 1].length
            ? cleanHistory
            : areDifferent
            ? {
                past: [...past, present],
                present: deepCopy(currentModules),
                future: [],
              }
            : prev;
      }
    });
    //newObject && setSessionHistory(newObject);
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage(null);
  };

  const handleKeyDown = (e) => {
    Tone.start();
  };

  const handleMouseMove = (e) => {
    setMousePosition([e.pageX, e.pageY]);
    drawingLine && drawingLine.line && drawingLine.line.position();
  };

  const handleMouseUp = () => {
    if (drawingLine && drawingLine.target) {
      handleConnect(drawingLine);
    }
    drawingLine && drawingLine.line && drawingLine.line.remove();
    setDrawingLine(null);
  };

  useEffect(() => {
    //resetWorkspace();
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;

    let session = {
      description: "No description",
      tags: ["musa"],
      bpm: Tone.Transport.bpm.value,
      modules: modules,
    };

    if (props.user && props.user.uid !== firebase.auth().currentUser.uid) {
      props.createNewSession(session);
      return;
    }

    //loadSession();
    //!props.session.length && Tone.Transport.start()
  }, [props.user, props.session, sessionKey]);

  useEffect(() => {
    addModule("MasterOut");
    return () => {
      console.log("transport cleared");
    };
  }, []);

  useEffect(() => {
    clearInterval(connectionAnimator);
    setConnectionAnimator(
      setInterval(() => {
        connections.forEach((e) => e.line.position());
      }, 16)
    );
  }, [connections]);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    //console.log(drawingLine);
  }, [drawingLine]);

  return (
    <div
      className="workspace"
      tabIndex={0}
      style={{
        display: props.hidden ? "none" : "flex",
      }}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* isPlaying && (
        <Helmet>
          <title>{"▶ " + document.title}</title>
        </Helmet>
      ) */}

      <LoadingScreen open={!Boolean(modules)} />

      {modules !== null ? (
        modules.map((module, moduleIndex) =>
          module.type === "MasterOut" ? (
            <MasterOut
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Oscillator" ? (
            <Oscillator
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "NoiseGenerator" ? (
            <NoiseGenerator
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "LFO" ? (
            <LFO
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Oscilloscope" ? (
            <Oscilloscope
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Analyzer" ? (
            <Analyzer
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Filter" ? (
            <Filter
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Envelope" ? (
            <Envelope
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "ChMixer" ? (
            <ChMixer
              nodes={nodes[module.id]}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : (
            ""
          )
        )
      ) : !modules.length ? (
        <Fragment>
          <Typography variant="h1">:v</Typography>
          <div className="break" />
          <p>{t("workspace.empty")}</p>
        </Fragment>
      ) : (
        ""
      )}

      <IconButton
        color="primary"
        style={{ marginTop: 48, left: 16 }}
        onClick={(e) => setModulePicker(e.target)}
      >
        <Icon style={{ fontSize: 40 }}>add_circle_outline</Icon>
      </IconButton>

      {modulePicker && (
        <Menu
          onClose={() => setModulePicker(null)}
          open={Boolean(modulePicker)}
          anchorEl={modulePicker}
        >
          {[
            "Oscillator",
            "LFO",
            "Filter",
            "Envelope",
            "ChMixer",
            "NoiseGenerator",
            "Oscilloscope",
            "Analyzer",
          ].map((e, i) => (
            <MenuItem
              onClick={() => {
                addModule(e);
                setModulePicker(null);
              }}
            >
              {e}
            </MenuItem>
          ))}
        </Menu>
      )}

      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Icon fontSize="small">close</Icon>
          </IconButton>
        }
      />

      <div
        id="cursor-pixel"
        style={{ left: mousePosition[0], top: mousePosition[1] }}
      />

      <Fab
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={() =>
          recorder.state === "started" ? stopRecording() : startRecording()
        }
        color={recorder.state === "started" ? "secondary" : "primary"}
      >
        <Icon>{recorder.state === "started" ? "stop" : "voicemail"}</Icon>
      </Fab>
    </div>
  );
}

export default Workspace;

const deepCopy = (a) => JSON.parse(JSON.stringify(a));
