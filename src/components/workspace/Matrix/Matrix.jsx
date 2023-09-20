import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "@/store/hooks";
import { toggleConnectionMatrix } from "@/store/uiSlice";

import { useSession } from "@/context/SessionContext";
import { getRandomColor } from "@/utils/colorUtils";
import { modulesInfo } from "@/utils/modulesInfo";

import "./Matrix.css";

function Matrix() {
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const close = () => dispatch(toggleConnectionMatrix());

  const { handleConnect, removeConnection } = useSession();

  const { modules, connections } = useSelector((state) => state.session);

  const outputs = modules.map((e) =>
    modulesInfo[e.type].con
      .map((e, i) => [e[0], i])
      .filter(
        (e) => e[0] === "out" || e[0] === "triggerout" || e[0] === "pitchout"
      )
  );

  const inputs = modules.map((e) =>
    modulesInfo[e.type].con
      .map((e, i) => [e[0], i])
      .filter(
        (e) =>
          e[0] === "in" ||
          e[0] === "mod" ||
          e[0] === "trigger" ||
          e[0] === "pitch"
      )
  );

  console.log(outputs, inputs);

  const checkConnection = (id1, con1, id2, con2) => {
    //console.log(id1, con1, id2, con2);
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
        color: getRandomColor(),
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
    <div className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center z-20">
      <div
        className="fixed h-full w-full bg-opacity-10 bg-black z-0"
        onClick={close}
      ></div>
      <div className="w-full max-w-6xl mx-2 overflow-y-scroll shadow bg-white grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-h-1/2 z-10">
        <div>
          <h2>{t("dialogs.insertName")}</h2>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="matrix-header-column">
              <div className="matrix-header-column-header" />
              {modules.map((e, i) =>
                !inputs[i].length ? null : (
                  <div
                    className="matrix-header-column-module"
                    style={{
                      height: inputs[i].length * 64,
                      background: e.c,
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
            {modules
              //.filter((e) => modulesConnections[e.type].hasOwnProperty("out"))
              .map((e, i) =>
                !outputs[i].length ? null : (
                  <div
                    className="matrix-module-column"
                    style={{
                      width: outputs[i].length * 64,
                      background: e.c,
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
                              {checkConnection(
                                modules[modIndex].id,
                                input[1],
                                e.id,
                                output[1]
                              ) && (
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
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
          </div>

          <button className="close-btn">x</button>
        </div>
      </div>
    </div>
  );
}

export default Matrix;
