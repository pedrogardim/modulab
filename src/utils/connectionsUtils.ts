import * as Tone from "tone";
import { modulesInfo } from "./modulesInfo";

// TODO: types

export const connect = (
  connection: any,
  connections: any,
  nodes: any,
  modules: any
) => {
  if (!nodes[connection.module] && !nodes[connection.target.module]) {
    console.log(
      "failed",
      nodes[connection.module],
      nodes[connection.target.module]
    );
    //handleConnect(connection);
    return;
  }

  const { originNode, targetNode, connectionTypes } = getModulesfromConnection(
    connection,
    modules,
    nodes
  );

  //check if is existing

  const exists = checkIfConnectionExists(connection, connections);

  if (exists) return;

  if (
    connectionTypes[0] === "out" &&
    (connectionTypes[1] === "in" || connectionTypes[1] === "mod")
  ) {
    Tone.connect(originNode, targetNode, [0], [0]);
    return true;
  } else if (
    (connectionTypes[0] === "in" || connectionTypes[0] === "mod") &&
    connectionTypes[1] === "out"
  ) {
    Tone.connect(targetNode, originNode, [0], [0]);
    return true;
  } else return;
};

// TODO: types

export const getModulesfromConnection = (
  connection: any,
  modules: any,
  nodes: any
) => {
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

  const originNode = nodes[connection.module][connectionNode[0]];
  const targetNode = nodes[connection.target.module][connectionNode[1]];

  return { originNode, targetNode, connectionTypes };
};

export const checkIfConnectionExists = (connection: any, connections: any) => {
  return !!connections.find(
    (existingConnection) =>
      (existingConnection.module === connection.module &&
        existingConnection.index === connection.index &&
        existingConnection.target.module === connection.target.module &&
        existingConnection.target.index === connection.target.index) ||
      (existingConnection.module === connection.target.module &&
        existingConnection.index === connection.target.index &&
        existingConnection.target.module === connection.module &&
        existingConnection.target.index === connection.index)
  );
};
