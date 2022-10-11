import { useEffect, useState } from "react";

import firebase from "firebase";

import * as Tone from "tone";

import { getRandomColor } from "../utils/colorUtils";

import { encodeAudioFile } from "../utils/audioutils";

import { useParams } from "react-router-dom";

function useSession() {
  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState({});

  const [connections, setConnections] = useState([]);

  const [recorder, setRecorder] = useState(new Tone.Recorder());
  const [isRecording, setIsRecording] = useState(false);

  const sessionKey = useParams().key;

  const loadConnections = () => {
    if (!localStorage.getItem("musalabsSession")) return;
    let conn = JSON.parse(localStorage.getItem("musalabsSession")).connections;
    if (connections.length !== conn.length)
      conn.forEach((e) => handleConnect(e));
  };

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
          c: getRandomColor(),
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
  /* 
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

  */

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

  return {
    modules,
    setModules,
    nodes,
    setNodes,
    connections,
    setConnections,
    isRecording,
    startRecording,
    stopRecording,
    handleConnect,
    removeConnection,
    addModule,
    removeModule,
    clearWorkspace,
  };
}

export default useSession;
