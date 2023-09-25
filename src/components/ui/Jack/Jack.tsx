import { useRef } from "react";
import classNames from "classnames";

import { getRandomColor } from "@/utils/colorUtils";

import { useDispatch, useSelector } from "@/store/hooks";
import { setDrawingLine } from "@/store/uiSlice";

import "./Jack.css";

function Jack({ module, index, type, label }) {
  const jackRef = useRef(null);

  const dispatch = useDispatch();
  const { drawingLine } = useSelector((state) => state.ui);

  const handleMouseDown = () => {
    dispatch(
      setDrawingLine({
        module: module.id,
        index: index,
        color: getRandomColor(),
      })
    );
  };

  const handleMouseEnter = () => {
    if (
      drawingLine &&
      (drawingLine.module !== module.id || drawingLine.index !== index)
    ) {
      dispatch(
        setDrawingLine({
          ...drawingLine,
          target: {
            module: module.id,
            index: index,
          },
        })
      );
    }
  };

  const handleMouseLeave = () => {
    let newDL = { ...drawingLine };
    delete newDL.target;
    dispatch(setDrawingLine(newDL));
  };

  return (
    <div
      className={classNames(
        "module-jack",
        type === "in"
          ? "bg-slate-800"
          : type.includes("mod")
          ? "bg-slate-800"
          : type.includes("trigger")
          ? "bg-orange-600"
          : type.includes("pitch")
          ? "bg-green-600"
          : "bg-indigo-600"
      )}
      id={`jack-${module.id}-${index}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={jackRef}
    >
      <div></div>
      <span className="module-jack-lbl">{label ? label : type}</span>
    </div>
  );
}

export default Jack;
