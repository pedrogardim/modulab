import { useEffect, useRef } from "react";

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
      className="module-jack"
      id={`jack-${module.id}-${index}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor:
          type === "in"
            ? "rgb(179, 120, 31)"
            : type.includes("mod")
            ? "grey"
            : type.includes("trigger")
            ? "#941EC0"
            : type.includes("pitch")
            ? "#1EC02A"
            : "rgb(32, 115, 192)",
      }}
      ref={jackRef}
    >
      <div></div>
      <span className="module-jack-lbl">{label ? label : type}</span>
    </div>
  );
}

export default Jack;
