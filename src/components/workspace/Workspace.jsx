import React, { useState, useRef } from "react";
import { useSession } from "@/context/SessionContext";
import useWorkspaceEvents from "@/hooks/useWorkspaceEvents";

import { useSelector } from "@/store/hooks";

import { Module } from "./Module";
import { Matrix } from "./Matrix";
import { Connection } from "./Connection";
import { HelperText } from "./HelperText";
import { SideMenu } from "./SideMenu";
import { ModuleSelector } from "./ModuleSelector";
import { PanZoomWrapper } from "./PanZoomWrapper";

import "./Workspace.css";

function Workspace(props) {
  const { setModules, nodes, setNodes, removeConnection, removeModule } =
    useSession();

  const { modules, connections } = useSelector((state) => state.session);

  const cursorPixelRef = useRef(null);

  const {
    mousePosition,
    moduleSelectorOpen,
    connectionMatrixOpen,
    deleteMode,
    drawingLine,
    rerenderToggle,
  } = useSelector((state) => state.ui);

  const workspaceEvents = useWorkspaceEvents();

  return (
    <>
      <div className="ws-background" />
      <HelperText />
      <SideMenu />
      <PanZoomWrapper>
        <div
          className="workspace"
          tabIndex={0}
          style={{
            display: props.hidden ? "none" : "flex",
            cursor: deleteMode && "not-allowed",
          }}
          {...workspaceEvents}
        >
          {modules &&
            modules.map((module, moduleIndex) => (
              <Module
                key={module.id}
                module={module}
                mousePosition={mousePosition}
                index={moduleIndex}
                setModules={setModules}
                removeModule={() => removeModule(module.id)}
                nodes={nodes[module.id]}
                cursorPixelRef={cursorPixelRef}
                connections={connections}
                setNodes={setNodes}
              />
            ))}
        </div>
      </PanZoomWrapper>
      <div
        id="cursor-pixel"
        ref={cursorPixelRef}
        style={{
          left: mousePosition && mousePosition[0],
          top: mousePosition && mousePosition[1],
        }}
      />
      {connections.map((e, i) => (
        <Connection
          deleteMode={deleteMode}
          connection={e}
          key={i + rerenderToggle}
          remove={() => removeConnection(i)}
        />
      ))}

      {connectionMatrixOpen && <Matrix />}
      {drawingLine && <Connection drawing connection={drawingLine} />}
      {moduleSelectorOpen && <ModuleSelector />}
    </>
  );
}

export default Workspace;
