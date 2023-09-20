import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import * as Tone from "tone";

import { EnvelopeNode } from "@/customNodes/EnvelopeNode";
import { saveRecording } from "@/utils/audioUtils";
import { createModule } from "@/utils/modulesUtils";
import { connect, getModulesfromConnection } from "@/utils/connectionsUtils";
import { useDispatch, useSelector } from "@/store/hooks";
import {
  addConnectionToStore,
  addModuleToStore,
  removeConnectionFromStore,
  removeModuleFromStore,
  saveSession,
} from "@/store/sessionSlice";

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
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState({});

  const { modules, connections } = useSelector((state) => state.session);

  const [recorder] = useState(new Tone.Recorder());
  const [isRecording, setIsRecording] = useState(false);

  const loadConnections = () => {
    if (!localStorage.getItem("musalabsSession")) return;
    let conn = JSON.parse(localStorage.getItem("musalabsSession")).connections;
    if (connections.length !== conn.length)
      conn.forEach((e) => handleConnect(e));
  };

  const loadSession = (json?: object) => {
    localStorage.setItem("musalabsSession", "");
    clearWorkspace(true);

    let session = json
      ? json
      : localStorage.getItem("musalabsSession") &&
        JSON.parse(localStorage.getItem("musalabsSession"));

    if (!session) return;

    session.modules.forEach((module) =>
      addModule(
        module.type,
        module,
        session.connections.filter((e) => module.module === e.id)
      )
    );

    Tone.Transport.start();
  };

  //TODO: load connections
  const addModule = (type, module) => {
    let moduleId =
      modules.length === 0 ? 0 : Math.max(...modules.map((e) => e.id)) + 1;

    const { nodes: moduleNodes, moduleInfo: newModule } = createModule(
      type,
      module,
      moduleId,
      recorder
    );

    setNodes((prev) => ({
      ...prev,
      [newModule.id]: moduleNodes,
    }));

    dispatch(addModuleToStore({ module: newModule }));
  };

  const removeModule = (id) => {
    nodes[id].forEach((e) => e && e.dispose && e.dispose());
    dispatch(removeModuleFromStore(id));
  };

  const handleConnect = (connection) => {
    console.log(connection);

    const successfullyConnected = connect(
      connection,
      connections,
      nodes,
      modules
    );

    if (!successfullyConnected) return;

    dispatch(addConnectionToStore(connection));
  };

  const removeConnection = (connectionIndex: number) => {
    let connection = connections[connectionIndex];

    const { originNode, targetNode, connectionTypes } =
      getModulesfromConnection(connection, modules, nodes);

    if (connectionTypes[0] === "out") {
      originNode.disconnect(targetNode);
    }
    if (connectionTypes[0] === "in") {
      targetNode.disconnect(originNode);
    }

    dispatch(removeConnectionFromStore(connectionIndex));
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
    saveRecording(recorder);
  };

  useEffect(() => {
    loadSession();
    EnvelopeNode.Initialize(Tone.getContext().rawContext);

    return () => {
      //console.log("transport cleared");
    };
  }, []);

  useEffect(() => {
    dispatch(saveSession());
    console.log(modules);
  }, [connections, modules]);

  useEffect(() => {
    loadConnections();
    console.log("nodes", nodes);
  }, [nodes]);

  return (
    <SessionContext.Provider
      value={{
        nodes,
        connections,
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
