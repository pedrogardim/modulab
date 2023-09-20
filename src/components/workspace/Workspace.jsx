import React, { useState, useRef } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useSession } from "@/context/SessionContext";
import useWorkspaceEvents from "@/hooks/useWorkspaceEvents";

import { useSelector } from "@/store/hooks";

import { Module } from "./Module";
import { Matrix } from "./Matrix";
import { Connection } from "./Connection";
import { HelperText } from "./HelperText";
import { SideMenu } from "./SideMenu";
import { ModuleSelector } from "./ModuleSelector";

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
  } = useSelector((state) => state.ui);

  const workspaceEvents = useWorkspaceEvents();

  const [moveState, setMoveState] = useState(false);

  return (
    <>
      <div className="ws-background" />
      {modules.length === 0 && <HelperText />}
      <SideMenu />
      <TransformWrapper
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        minScale={0.1}
        maxScale={2}
        wheel={{ step: 0.1 }}
        initialPositionX={-4500}
        initialPositionY={-4500}
        panning={{
          excluded: [
            "module",
            "module-jack",
            "knob",
            "close-btn",
            "select",
            "option",
            "span",
            "button",
            "text-input",
            "input",
          ],
        }}
        onWheel={() => setMoveState((p) => !p)}
        onPanning={() => setMoveState((p) => !p)}
        onZoom={() => setMoveState((p) => !p)}
        onPinching={() => setMoveState((p) => !p)}
      >
        <TransformComponent>
          <div
            className="workspace"
            tabIndex={0}
            style={{
              display: props.hidden ? "none" : "flex",
              cursor: deleteMode && "not-allowed",
            }}
            {...workspaceEvents}
          >
            {modules !== null
              ? modules.map((module, moduleIndex) => (
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
                ))
              : ""}
          </div>
        </TransformComponent>
      </TransformWrapper>

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
          key={i + moveState}
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
