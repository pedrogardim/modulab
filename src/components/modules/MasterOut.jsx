import { Jack } from "../ui/Jack";

function MasterOut(props) {
  return (
    <>
      <Jack
        type="in"
        index={0}
        module={props.module}
        setDrawingLine={props.setDrawingLine}
        drawingLine={props.drawingLine}
      />
    </>
  );
}

export default MasterOut;
