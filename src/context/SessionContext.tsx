import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import * as Tone from "tone";

import { EnvelopeNode } from "@/customNodes/EnvelopeNode";
import { encodeAudioFile } from "@/utils/audioutils";
import { modulesInfo } from "@/utils/modulesInfo";
import { createModule } from "@/utils/modulesUtils";

type SessionType = {
  nodes: object;
  addModule: (moduleType: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<[]>>;
};

const SessionContext = createContext<SessionType | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState({});

  const [connections, setConnections] = useState([]);

  const [recorder] = useState(new Tone.Recorder());
  const [isRecording, setIsRecording] = useState(false);

  const loadConnections = () => {
    if (!localStorage.getItem("musalabsSession")) return;
    let conn = JSON.parse(localStorage.getItem("musalabsSession")).connections;
    if (connections.length !== conn.length)
      conn.forEach((e) => handleConnect(e));
  };

  const loadSession = (json) => {
    localStorage.setItem("musalabsSession", "");
    clearWorkspace(true);

    let session = json
      ? json
      : localStorage.getItem("musalabsSession") &&
        JSON.parse(localStorage.getItem("musalabsSession"));

    if (!session) return;

    session.modules.forEach((e) =>
      addModule(
        e.type,
        e,
        session.connections.filter((e) => e.module === e.id),
        recorder
      )
    );

    Tone.Transport.start();
  };

  const addModule = (type, module) => {
    let moduleId = !modules.length
      ? 0
      : Math.max(...modules.map((e) => e.id)) + 1;

    const { nodes, moduleInfo: newModule } = createModule(
      type,
      module,
      moduleId,
      recorder
    );

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
    if (!nodes[connection.module] && !nodes[connection.target.module]) {
      console.log(
        "failed",
        nodes[connection.module],
        nodes[connection.target.module]
      );
      //handleConnect(connection);
      return;
    }

    const modulesTypes = [
      [modules.find((e) => e.id === connection.module).type, connection.index],
      [
        modules.find((e) => e.id === connection.target.module).type,
        connection.target.index,
      ],
    ];

    const connectionTypes = modulesTypes.map(
      (t) => modulesInfo[t[0]].con[t[1]][0]
    );

    const connectionNode = modulesTypes.map(
      (t) => modulesInfo[t[0]].con[t[1]][1]
    );

    let originNode = nodes[connection.module][connectionNode[0]];
    let targetNode = nodes[connection.target.module][connectionNode[1]];

    console.log(originNode, targetNode);

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
      connectionTypes[0] === "out" &&
      (connectionTypes[1] === "in" || connectionTypes[1] === "mod")
    ) {
      //originNode.connect(targetNode);
      try {
        Tone.connect(originNode, targetNode, [0], [0]);
        //originNode.connect(targetNode);
      } catch (e) {
        console.log(e);
      }
    } else if (
      (connectionTypes[0] === "in" || connectionTypes[0] === "mod") &&
      connectionTypes[1] === "out"
    ) {
      //console.log("case2");
      //targetNode.connect(originNode);
      try {
        Tone.connect(targetNode, originNode, [0], [0]);
        //targetNode.connect(originNode);
      } catch (e) {
        console.log(e);
      }
    } else return true;
    setConnections((prev) => [...prev, connection]);
  };

  const removeConnection = (connIndex) => {
    let connection = connections[connIndex];

    const modulesTypes = [
      [modules.find((e) => e.id === connection.module).type, connection.index],
      [
        modules.find((e) => e.id === connection.target.module).type,
        connection.target.index,
      ],
    ];

    console.log(modulesTypes);

    const connectionTypes = modulesTypes.map(
      (t) => modulesInfo[t[0]].con[t[1]][0]
    );

    const connectionNode = modulesTypes.map(
      (t) => modulesInfo[t[0]].con[t[1]][1]
    );

    let originNode = nodes[connection.module][connectionNode[0]];
    let targetNode = nodes[connection.target.module][connectionNode[1]];

    if (connectionTypes[0] === "out") {
      originNode.disconnect(targetNode);
    }
    if (connectionTypes[0] === "in") {
      targetNode.disconnect(originNode);
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
    console.log("USEEFFECT TRIGGERED");

    loadSession();
    EnvelopeNode.Initialize(Tone.getContext().rawContext)
      .then((e) => console.log("EnvelopeNode.Initialize"))
      .catch((e) => console.log(e));
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
    console.log("nodes", nodes);
  }, [nodes]);

  useEffect(() => {
    console.log(modules);
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

  return (
    <SessionContext.Provider
      value={{
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
