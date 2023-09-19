import React, { useState, useRef } from "react";

import { Icon } from "../ui/Icon";

import { useTranslation } from "react-i18next";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { modulesInfo } from "../../utils/modulesInfo";

import useSession from "../../hooks/useSession";

import { Module } from "./Module";
import { Matrix } from "./Matrix";
import { Connection } from "./Connection";
import { HelperText } from "./HelperText";
import { SideMenu } from "./SideMenu";

import "./Workspace.css";

function Workspace(props) {
  const { t } = useTranslation();
  const {
    modules,
    setModules,
    nodes,
    setNodes,
    connections,
    // setConnections,
    isRecording,
    startRecording,
    stopRecording,
    handleConnect,
    removeConnection,
    addModule,
    removeModule,
    clearWorkspace,
  } = useSession();

  const cursorPixelRef = useRef(null);

  const [mousePosition, setMousePosition] = useState([]);
  const [soundStarted, setSoundStarted] = useState(false);
  const [modulePicker, setModulePicker] = useState(false);
  const [drawingLine, setDrawingLine] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const [moveState, setMoveState] = useState(false);

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

  return (
    <>
      <div className="ws-background" />
      {/* !soundStarted && (
        <div
          className="sound-start-layer"
          onClick={() => {
            setSoundStarted(true);
            Tone.start();
          }}
        >
          play_arrow
        </div>
      ) */}
      {modules.length === 0 && <HelperText />}
      <SideMenu />

      <TransformWrapper
        limitToBounds={false}
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
              cursor: isDeleting && "not-allowed",
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {modules !== null
              ? modules.map((module, moduleIndex) => (
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
                    cursorPixelRef={cursorPixelRef}
                    connections={connections}
                    setNodes={setNodes}
                  />
                ))
              : ""}

            {/* TODO: Not showing */}
            <select
              style={{ width: 100, height: 50 }}
              // onChange={}
            >
              {Object.keys(modulesInfo).map((e, i) => (
                <option
                  onClick={() => {
                    addModule(e);
                    //setModulePicker(null);
                  }}
                  key={i}
                >
                  {e}
                </option>
              ))}
            </select>

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
          isDeleting={isDeleting}
          connection={e}
          key={i + moveState * 1}
          remove={() => removeConnection(i)}
        />
      ))}

      {drawingLine && <Connection drawing connection={drawingLine} />}
      {/* <button
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <Icon icon="abTesting" title="User Profile" size={1} />
      </button>

      <button
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 80 }}
        onClick={(e) => setModulePicker(e.target)}
      >
        <Icon icon="abTesting" title="User Profile" size={1} />
      </button>

      <button
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 144 }}
        onClick={() => clearWorkspace()}
      >
        <Icon icon="abTesting" title="User Profile" size={1} />
      </button>
      <button
        color="primary"
        style={{ position: "absolute", bottom: 16, right: 208 }}
        onClick={() => setMatrix(true)}
      >
        <Icon icon="account" title="User Profile" size={1} />
      </button> */}
    </>
  );
}

export default Workspace;

const deepCopy = (a) => JSON.parse(JSON.stringify(a));
