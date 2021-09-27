import React, { useState, useEffect, Fragment } from "react";
import * as Tone from "tone";
import firebase from "firebase";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import { Card, Icon, IconButton } from "@material-ui/core";

import Draggable from "react-draggable";
import Jack from "./Components/Jack";

function MasterOut(props) {
  return (
    <Draggable cancel=".module-jack, .module-knob">
      <Card
        className="module"
        style={{
          height: 100,
          width: 100,
        }}
      >
        <Jack
          type="in"
          index={0}
          module={props.module}
          setDrawingLine={props.setDrawingLine}
          drawingLine={props.drawingLine}
        />
      </Card>
    </Draggable>
  );
}

export default MasterOut;
