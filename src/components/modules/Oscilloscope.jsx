import { useState, useEffect } from "react";
import { Jack } from "../ui/Jack";

function Oscilloscope(props) {
  const [animator, setAnimator] = useState(null);

  const drawWave = (oscdata) => {
    var canvas = document.getElementById(`oscilloscope-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    //find first phase

    let wave = oscdata.filter(
      (e, i) => i > oscdata.findIndex((e) => e > -0.005 && e < 0.005)
    );

    if (wave[1] > wave[0]) {
      return;
    }

    ctx.strokeStyle = "#3f51b5";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    let max = Math.max(...wave) - 8;

    wave.map((e, i) => {
      ctx.lineTo(i + 1, (e / max) * canvasHeight + canvasHeight / 2, 1, 1);
    });

    ctx.stroke();
  };

  useEffect(() => {
    setAnimator(
      setInterval(() => {
        let oscdata = props.nodes[0].getValue();
        drawWave(oscdata);
      }, 32)
    );
    return () => {
      clearInterval(animator);
    };
  }, []);

  return (
    <>
      <canvas
        height="250px"
        width="512px"
        style={{ pointerEvents: "none", imageRendering: "pixelated" }}
        id={`oscilloscope-${props.module.id}`}
      />
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

export default Oscilloscope;
