import React, { useRef } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Icon,
} from "@material-ui/core";

import "./Matrix.css";

import { useTranslation } from "react-i18next";

function Matrix(props) {
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const { modules, connections, handleConnect, removeConnection } = props;

  const modulesConnections = {
    Analyzer: [["in", 0]],

    ChMixer: [
      ["in", 1],
      ["in", 2],
      ["in", 3],
      ["in", 4],
      ["out", 0],
    ],
    Envelope: [["in", 0][("trigger", 2)], ["out", 1]],
    Filter: [["in", 0], "out", 1],
    LFO: [["out", 0]],
    MasterOut: [["in", 0]],
    NoiseGenerator: [["out", 0]],
    Oscillator: [
      ["out", 0],
      ["mod", 1],
    ],

    Oscilloscope: [["in", 0]],
    Trigger: [["triggerout", 0]],
  };

  const outputs = modules.map((e) =>
    modulesConnections[e.type].filter((e) => e[0] === "out")
  );

  const inputs = modules.map((e) =>
    modulesConnections[e.type].filter((e) => e[0] === "in" || e[0] === "mod")
  );

  const checkConnection = (id1, con1, id2, con2) => {
    let result = connections.find(
      (e, i) =>
        (e.module === id1 &&
          e.index === con1 &&
          e.target.module === id2 &&
          e.target.index === con2) ||
        (e.module === id2 &&
          e.index === con2 &&
          e.target.module === id1 &&
          e.target.index === con1)
    );
    //console.log(result);
    return result ? result.color : null;
  };

  const onTileClick = (id1, con1, id2, con2) => {
    if (!checkConnection(id1, con1, id2, con2)) {
      handleConnect({
        module: id1,
        index: con1,
        type: "out",
        color: "#" + (Math.random().toString(16) + "00000").slice(2, 8),
        target: {
          module: id2,
          index: con2,
          type: "in",
        },
      });
    } else {
      removeConnection(
        connections.findIndex(
          (e, i) =>
            (e.module === id1 &&
              e.index === con1 &&
              e.target.module === id2 &&
              e.target.index === con2) ||
            (e.module === id2 &&
              e.index === con2 &&
              e.target.module === id1 &&
              e.target.index === con1)
        )
      );
    }
  };

  return (
    <Dialog
      open
      fullWidth
      onClose={props.onClose}
      maxWidth={"lg"}
      scroll={"paper"}
    >
      <DialogTitle>{t("dialogs.insertName")}</DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "row" }}>
        <div className="matrix-header-column">
          <div className="matrix-header-column-header" />
          {modules.map((e, i) =>
            !inputs[i].length ? null : (
              <div
                className="matrix-header-column-module"
                style={{
                  height: inputs[i].length * 64,
                }}
              >
                {e.type}
                <div
                  className="matrix-header-column-module-inputs-cont"
                  style={{
                    height: inputs[i].length * 64,
                  }}
                >
                  {inputs[i].map((e, i) => (
                    <div className="matrix-header-column-module-input">
                      {e[0]}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
        {/* <></> */}
        {modules
          //.filter((e) => modulesConnections[e.type].hasOwnProperty("out"))
          .map((e, i) =>
            !outputs[i].length ? null : (
              <div
                className="matrix-module-column"
                style={{
                  width: outputs[i].length * 64,
                }}
              >
                <div
                  className="matrix-module-column-header"
                  style={{
                    width: outputs[i].length * 64,
                  }}
                >
                  {e.type}
                </div>
                {outputs[i].map((output, outIndex) => (
                  <div className="matrix-module-connection-column">
                    <div
                      className="matrix-module-connection-column-header"
                      style={{
                        width: output[1].length * 64,
                      }}
                    >
                      {output[0]}
                    </div>
                    {inputs.map((module, modIndex) =>
                      module.map((input, inputIndex) => (
                        <div
                          className="matrix-module-connection-tile"
                          onClick={() =>
                            onTileClick(
                              e.id,
                              output[1],
                              modules[modIndex].id,
                              input[1]
                            )
                          }
                        >
                          <div
                            style={{
                              backgroundColor: checkConnection(
                                modules[modIndex].id,
                                input[1],
                                e.id,
                                output[1]
                              ),
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )
          )}
      </DialogContent>

      <IconButton className="close-btn" onClick={props.onClose}>
        <Icon>close</Icon>
      </IconButton>
    </Dialog>
  );
}

export default Matrix;
