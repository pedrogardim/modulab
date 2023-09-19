import { useSelector, useDispatch } from "@/store/hooks";
import { updateMousePosition } from "@/store/uiSlice";

import * as Tone from "tone";

const useWorkspaceEvents = () => {
  const dispatch = useDispatch();
  const handleKeyDown = (e) => {
    Tone.start();
    // if (e.key === "Alt") setIsDeleting(true);
  };

  const handleKeyUp = (e) => {
    Tone.start();
    // if (e.key === "Alt") setIsDeleting(false);
  };

  const handleMouseDown = (e) => {
    dispatch(updateMousePosition([e.pageX, e.pageY]));
  };

  const handleMouseMove = (e) => {
    dispatch(updateMousePosition([e.pageX, e.pageY]));
  };

  const handleMouseUp = () => {
    // if (drawingLine && drawingLine.target) {
    //   handleConnect(drawingLine);
    // }
    // setDrawingLine(null);
    dispatch(updateMousePosition(null));
  };

  return {
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };
};

export default useWorkspaceEvents;
