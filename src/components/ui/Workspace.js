import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
import { Helmet } from "react-helmet";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

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

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import LoadingScreen from "./LoadingScreen";

import Module from "./Modules/Module";

import ActionConfirm from "./Dialogs/ActionConfirm";
import Matrix from "./Matrix/Matrix";

import Connection from "./Connection";

import "./Workspace.css";

function Workspace(props) {
  const { t } = useTranslation();

  const [mousePosition, setMousePosition] = useState([]);

  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState({});

  const [connections, setConnections] = useState([]);
  const [soundStarted, setSoundStarted] = useState(false);

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

  const [isDeleting, setIsDeleting] = useState(false);

  const [matrix, setMatrix] = useState(false);

  const sessionKey = useParams().key;
  const autoSaverTime = 5 * 60 * 1000; //5min

  const loadSession = (json) => {
    clearWorkspace(true);

    let session = json
      ? json
      : localStorage.getItem("musalabsSession") &&
        JSON.parse(localStorage.getItem("musalabsSession"));

    /*  if (
      !session ||
      session.modules.findIndex((e) => e.type === "MasterOut") === -1
    ) {
      addModule("MasterOut");
    } */

    if (!session) return;

    //console.log("loading session", session);

    session.modules.forEach((e) =>
      addModule(
        e.type,
        e,
        session.connections.filter((e) => e.module === e.id)
      )
    );

    //session.connections.forEach((e) => handleConnect(e));
  };

  const loadConnections = () => {
    if (!localStorage.getItem("musalabsSession")) return;
    let conn = JSON.parse(localStorage.getItem("musalabsSession")).connections;
    if (connections.length !== conn.length)
      conn.forEach((e) => handleConnect(e));
  };

  const addModule = (type, module, conn) => {
    //console.log("adding module", type, module, conn);
    let moduleId = !modules.length
      ? 0
      : Math.max(...modules.map((e) => e.id)) + 1;
    let newModule = module
      ? { ...module }
      : {
          id: moduleId,
          type: type,
          x: 0,
          y: 0,
          c: "#" + (Math.random().toString(16) + "00000").slice(2, 8),
        };

    if (modules.findIndex((e) => newModule.id === e.id) !== -1) {
      //console.log("prevented", newModule.id);
      return;
    }

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
      [newModule.id]: nodes,
    }));

    setModules((prev) => [...prev, newModule]);
  };

  const removeModule = (id) => {
    setConnections((prev) =>
      prev.filter((e) => e.module !== id && e.target.module !== id)
    );
    nodes[id].forEach((e) => e && e.dispose && e.dispose());
    setModules((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConnect = (connection) => {
    //console.log(connection);
    if (!nodes[connection.module] || !nodes[connection.target.module]) {
      //console.log("failed");
      //handleConnect(connection);
      return;
    }
    let originNode = nodes[connection.module][connection.index];
    let targetNode = nodes[connection.target.module][connection.target.index];

    //check if is existing

    if (
      connections.find(
        (e, i) =>
          (e.module === connection.module &&
            e.index === connection.index &&
            e.target.module === connection.target.module &&
            e.target.index === connection.target.index) ||
          (e.module === connection.target.module &&
            e.index === connection.target.index &&
            e.target.module === connection.module &&
            e.target.index === connection.index)
      )
    )
      return;

    if (
      connection.type === "out" &&
      (connection.target.type === "in" || connection.target.type === "mod")
    ) {
      originNode.connect(targetNode);
    } else if (
      (connection.type === "in" || connection.type === "mod") &&
      connection.target.type === "out"
    ) {
      targetNode.connect(originNode);
    } else if (
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
    } else if (
      connection.target.type === "trigger" &&
      connection.type === "triggerout"
    ) {
      setNodes((prev) => {
        let newNodes = { ...prev };
        newNodes[connection.module][newNodes[connection.module].length] =
          newNodes[connection.target.module][0];
        return newNodes;
      });
    } else return true;
    setConnections((prev) => [...prev, connection]);
  };

  const removeConnection = (connIndex) => {
    let connection = connections[connIndex];
    let originNode = nodes[connection.module][connection.index];
    let targetNode = nodes[connection.target.module][connection.target.index];

    if (connection.type === "out") {
      originNode.disconnect(targetNode);
    }
    if (connection.type === "in") {
      targetNode.disconnect(originNode);
    }
    if (connection.type === "trigger") {
      setNodes((prev) => {
        let newNodes = { ...prev };
        delete newNodes[connection.target.module][
          newNodes[connection.target.module].length
        ];
        return newNodes;
      });
    }
    if (connection.type === "triggerout") {
      setNodes((prev) => {
        let newNodes = { ...prev };
        delete newNodes[connection.module][newNodes[connection.module].length];
        return newNodes;
      });
    }

    setConnections((prev) => prev.filter((e, i) => i !== connIndex));
  };

  const clearWorkspace = (total) => {
    modules.forEach((e, i) => {
      //if (e.type !== "MasterOut")
      removeModule(e.id);
    });
    if (total) return;
    addModule("MasterOut");
  };

  const startRecording = () => {
    setIsRecording(true);
    recorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stop().then((blob) => {
      //console.log(blob);
      blob.arrayBuffer().then((arrayBuffer) => {
        //console.log(arrayBuffer);
        Tone.getContext().rawContext.decodeAudioData(
          arrayBuffer,
          (audiobuffer) => {
            //console.log(audiobuffer);
            const url = URL.createObjectURL(
              encodeAudioFile(audiobuffer, "wav")
            );
            const anchor = document.createElement("a");
            anchor.download =
              new Date()
                .toLocaleString()
                .replaceAll("/", "-")
                .replaceAll(" ", "_")
                .replaceAll(":", "-") + ".wav";
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
    //Tone.start();
    if (e.key === "Alt") setIsDeleting(true);
  };

  const handleKeyUp = (e) => {
    //Tone.start();
    if (e.key === "Alt") setIsDeleting(false);
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
    //localStorage.setItem("musalabsSession", "");

    loadSession();
    // addModule("Envelope");
    // addModule("Trigger");

    return () => {
      //console.log("transport cleared");
    };
  }, []);

  useEffect(() => {
    //console.log(connections);
    connections &&
      connections.length > 0 &&
      localStorage.setItem(
        "musalabsSession",
        JSON.stringify({
          modules: [...modules],
          connections: [...connections],
        })
      );
  }, [connections]);

  useEffect(() => {
    loadConnections();
    //console.log("nodes", nodes);
  }, [nodes]);

  useEffect(() => {
    //console.log(modules);
    if (modules && modules.length > 0) {
      localStorage.setItem(
        "musalabsSession",
        JSON.stringify({
          modules: [...modules],
          connections: [...connections],
        })
      );
      //console.log("stored");
    }
  }, [modules]);

  useEffect(() => {
    /* mousePosition &&
      drawingLine &&
      drawingLine.line &&
      drawingLine.line.position(); */
    //console.log(drawingLine);
  }, [drawingLine]);

  return (
    <>
      <div className="ws-background" />

      <TransformWrapper
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        panning={{
          excluded: ["module", "module-jack", "module-knob", "close-btn"],
        }}
      >
        <TransformComponent>
          <div
            className="workspace"
            tabIndex={0}
            style={{
              display: props.hidden ? "none" : "flex",
              cursor: isDeleting && "not-allowed",
              /*  transform: "scale(0.5)", */
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {!soundStarted && (
              <div
                className="sound-start-layer"
                onClick={() => {
                  setSoundStarted(true);
                  Tone.start();
                }}
              >
                <Icon>play_arrow</Icon>
              </div>
            )}
            {/* isPlaying && (
        <Helmet>
          <title>{"▶ " + document.title}</title>
        </Helmet>
      ) */}

            <LoadingScreen open={!Boolean(modules)} />

            {modules !== null ? (
              modules.map((module, moduleIndex) => (
                <Module
                  key={module.id}
                  module={module}
                  mousePosition={mousePosition}
                  setDrawingLine={setDrawingLine}
                  index={moduleIndex}
                  setModules={setModules}
                  drawingLine={drawingLine}
                  removeModule={() => removeModule(module.id)}
                  nodes={nodes[module.id]}
                />
              ))
            ) : !modules.length ? (
              <>
                <Typography variant="h1">:v</Typography>
                <div className="break" />
                <p>{t("workspace.empty")}</p>
              </>
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
                  "MasterOut",
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

            {matrix && (
              <Matrix
                onClose={() => setMatrix(false)}
                modules={modules}
                nodes={nodes}
                connections={connections}
                handleConnect={handleConnect}
                removeConnection={removeConnection}
              />
            )}

            {/* <Snackbar
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
          /> */}
          </div>
        </TransformComponent>
      </TransformWrapper>
      <div
        id="cursor-pixel"
        style={{
          left: mousePosition && mousePosition[0],
          top: mousePosition && mousePosition[1],
        }}
      />
      {connections.map((e, i) => (
        <Connection
          isDeleting={isDeleting}
          connection={e}
          key={i}
          remove={() => removeConnection(i)}
        />
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
        <Icon>add</Icon>
      </Fab>

      <Fab
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 144 }}
        onClick={() => clearWorkspace()}
      >
        <Icon>delete</Icon>
      </Fab>
      <Fab
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 208 }}
        onClick={() => setMatrix(true)}
      >
        <Icon>grid_on</Icon>
      </Fab>
    </>
  );
}

export default Workspace;

const deepCopy = (a) => JSON.parse(JSON.stringify(a));

function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}
