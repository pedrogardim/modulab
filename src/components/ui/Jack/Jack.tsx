import { useRef } from "react";

import { useTranslation } from "react-i18next";

import { getRandomColor } from "../../../utils/colorUtils";

import "./Jack.css";

function Jack(props) {
  const { t } = useTranslation();
  const jackRef = useRef(null);

  const handleMouseDown = () => {
    props.setDrawingLine({
      module: props.module.id,
      index: props.index,
      color: getRandomColor(),
    });
  };

  const handleMouseEnter = () => {
    if (
      props.drawingLine &&
      (props.drawingLine.module !== props.module.id ||
        props.drawingLine.index !== props.index)
    ) {
      props.setDrawingLine((prev) => ({
        ...prev,
        target: {
          module: props.module.id,
          index: props.index,
        },
      }));
    }
  };

  const handleMouseLeave = (e) => {
    props.setDrawingLine((prev) => {
      let newDL = { ...prev };
      delete newDL.target;
      return newDL;
    });
  };

  return (
    <div
      className="module-jack"
      id={`jack-${props.module.id}-${props.index}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor:
          props.type === "in"
            ? "rgb(179, 120, 31)"
            : props.type.includes("mod")
            ? "grey"
            : props.type.includes("trigger")
            ? "#941EC0"
            : props.type.includes("pitch")
            ? "#1EC02A"
            : "rgb(32, 115, 192)",
      }}
      ref={jackRef}
    >
      <div></div>
      <span className="module-jack-lbl">
        {props.label ? props.label : props.type}
      </span>
    </div>
  );
}

export default Jack;
