import React, { useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import LeaderLine from "leader-line-new";

import { useParams } from "react-router-dom";

import { encodeAudioFile } from "../../utils/audioutils";

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
import Trigger from "./Modules/Trigger";

import ActionConfirm from "./Dialogs/ActionConfirm";

import Connection from "./Connection";

import "./Workspace.css";

function Workspace(props) {
  const { t } = useTranslation();

  const [mousePosition, setMousePosition] = useState([]);

  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState({});

  const [connections, setConnections] = useState([]);

  const [recorder, setRecorder] = useState(new Tone.Recorder());
  const [isRecording, setIsRecording] = useState(false);

  const [modulePicker, setModulePicker] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [sessionHistory, setSessionHistory] = useState({
    past: [],
    present: null, // (?) How do we initialize the present?
    future: [],
  });

  const [drawingLine, setDrawingLine] = useState(null);

  const [optionsMenu, setOptionsMenu] = useState(false);

  const [deleting, setDeleting] = useState(false);

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
      let meter = new Tone.FFT(4096);
      nodes = [meter];
    } else if (type === "Filter") {
      let gain = new Tone.Limiter(0);
      let filter = new Tone.Filter().connect(gain);
      nodes = [filter, gain];
    } else if (type === "Envelope") {
      let gain = new Tone.Gain();
      let envelope = new Tone.AmplitudeEnvelope().connect(gain);

      nodes = [envelope, gain, null];
    } else if (type === "ChMixer") {
      let master = new Tone.Channel(-12);
      let ch1 = new Tone.Channel(0).connect(master);
      let ch2 = new Tone.Channel(0).connect(master);
      let ch3 = new Tone.Channel(0).connect(master);
      let ch4 = new Tone.Channel(0).connect(master);

      nodes = [master, ch1, ch2, ch3, ch4];
    } else if (type === "Trigger") {
      let signal = new Tone.Signal({ units: "normalRange" });

      nodes = [signal];
    }

    setNodes((prev) => ({
      ...prev,
      [moduleId]: nodes,
    }));
  };

  const removeModule = (id) => {
    setConnections((prev) =>
      prev.filter((e) => e.module !== id && e.target.module !== id)
    );
    nodes[id].forEach((e) => e.dispose());
    setModules((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConnect = (connection) => {
    setConnections((prev) => [...prev, connection]);

    let originNode = nodes[connection.module][connection.index];
    let targetNode = nodes[connection.target.module][connection.target.index];

    if (
      connection.type === "out" &&
      (connection.target.type === "in" || connection.target.type === "mod")
    ) {
      originNode.connect(targetNode);
    }
    if (
      (connection.type === "in" || connection.type === "mod") &&
      connection.target.type === "out"
    ) {
      targetNode.connect(originNode);
    }
    if (
      connection.type === "trigger" &&
      connection.target.type === "triggerout"
    ) {
      setNodes((prev) => {
        let newNodes = { ...prev };
        newNodes[connection.target.module][
          newNodes[connection.target.module].length
        ] = newNodes[connection.module][0];
        return newNodes;
      });
    }
    if (
      connection.target.type === "trigger" &&
      connection.type === "triggerout"
    ) {
      setNodes((prev) => {
        let newNodes = { ...prev };
        newNodes[connection.module][newNodes[connection.module].length] =
          newNodes[connection.target.module][0];
        return newNodes;
      });
    }
  };

  const removeConnection = (connection) => {};

  const startRecording = () => {
    setIsRecording(true);
    recorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stop().then((blob) => {
      console.log(blob);
      blob.arrayBuffer().then((arrayBuffer) => {
        console.log(arrayBuffer);
        Tone.getContext().rawContext.decodeAudioData(
          arrayBuffer,
          (audiobuffer) => {
            console.log(audiobuffer);
            const url = URL.createObjectURL(
              encodeAudioFile(audiobuffer, "mp3")
            );
            const anchor = document.createElement("a");
            anchor.download = "recording.mp3";
            anchor.href = url;
            anchor.click();
          }
        );
      });
    });
    // download the recording by creating an anchor element and blob url
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
    if (e.key === "Control") setDeleting(true);
  };

  const handleMouseDown = (e) => {
    setMousePosition([e.pageX, e.pageY]);
  };

  const handleMouseMove = (e) => {
    mousePosition && setMousePosition([e.pageX, e.pageY]);
  };

  const handleMouseUp = () => {
    if (drawingLine && drawingLine.target) {
      handleConnect(drawingLine);
    }
    setDrawingLine(null);
    setMousePosition(null);
  };

  useEffect(() => {
    //resetWorkspace();

    let session = {
      description: "No description",
      tags: ["musa"],
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
    // addModule("Envelope");
    // addModule("Trigger");

    return () => {
      console.log("transport cleared");
    };
  }, []);

  useEffect(() => {
    console.log(connections);
  }, [connections]);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    /* mousePosition &&
      drawingLine &&
      drawingLine.line &&
      drawingLine.line.position(); */
    //console.log(mousePosition);
  }, [mousePosition]);

  return (
    <div
      className="workspace"
      tabIndex={0}
      style={{
        display: props.hidden ? "none" : "flex",
        /*  transform: "scale(0.5)", */
      }}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
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
              mousePosition={mousePosition}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Oscillator" ? (
            <Oscillator
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "NoiseGenerator" ? (
            <NoiseGenerator
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "LFO" ? (
            <LFO
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Oscilloscope" ? (
            <Oscilloscope
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Analyzer" ? (
            <Analyzer
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Filter" ? (
            <Filter
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Envelope" ? (
            <Envelope
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "ChMixer" ? (
            <ChMixer
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
              module={module}
              setDrawingLine={setDrawingLine}
              drawingLine={drawingLine}
              removeModule={() => removeModule(module.id)}
            />
          ) : module.type === "Trigger" ? (
            <Trigger
              nodes={nodes[module.id]}
              mousePosition={mousePosition}
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
            "Trigger",
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

      {
        <div
          id="cursor-pixel"
          style={{
            left: mousePosition && mousePosition[0],
            top: mousePosition && mousePosition[1],
          }}
        />
      }

      {connections.map((e, i) => (
        <Connection connection={e} key={i} />
      ))}

      {drawingLine && <Connection drawing connection={drawingLine} />}

      <Fab
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={isRecording ? stopRecording : startRecording}
        color={isRecording ? "secondary" : "primary"}
      >
        <Icon>{isRecording ? "stop" : "voicemail"}</Icon>
      </Fab>

      <Fab
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 80 }}
        onClick={(e) => setModulePicker(e.target)}
      >
        <Icon style={{ fontSize: 40 }}>add</Icon>
      </Fab>
    </div>
  );
}

export default Workspace;

const deepCopy = (a) => JSON.parse(JSON.stringify(a));
