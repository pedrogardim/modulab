import React, { useState, useEffect, Fragment, useRef } from "react";

import { useTranslation } from "react-i18next";
import LeaderLine from "leader-line-new";

import "./Jack.css";

function Jack(props) {
  const { t } = useTranslation();
  const jackRef = useRef(null);

  const handleMouseDown = () => {
    props.setDrawingLine({
      module: props.module.id,
      index: props.index,
      type: props.type,
      color: "#" + (Math.random().toString(16) + "00000").slice(2, 8),
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
          type: props.type,
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
            : props.type.includes("mod") || props.type.includes("trigger")
            ? "grey"
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
