import React, { useState, useRef } from "react";
import * as Tone from "tone";
import { useTranslation } from "react-i18next";

import { Fab, Icon, Typography, Menu, MenuItem } from "@material-ui/core";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { modulesInfo } from "../../utils/modulesInfo";

import useSession from "../../hooks/useSession";

import Module from "./Modules/Module";
import Matrix from "./Matrix/Matrix";
import Connection from "./Connection";

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
          <Icon>play_arrow</Icon>
        </div>
      ) */}

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
                  cursorPixelRef={cursorPixelRef}
                  connections={connections}
                  setNodes={setNodes}
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
                {Object.keys(modulesInfo).map((e, i) => (
                  <MenuItem
                    onClick={() => {
                      addModule(e);
                      setModulePicker(null);
                    }}
                    key={i}
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
