import { useState, useEffect } from "react";
import { Jack } from "../ui/Jack";

function Analyzer(props) {
  const [animator, setAnimator] = useState(null);
  const [logMode, setLogMode] = useState(false);

  const drawWave = (oscdata) => {
    var canvas = document.getElementById(`analyzer-${props.module.id}`);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    ctx.strokeStyle = "#3f51b5";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    let max = Math.max(...oscdata);
    let min = Math.min(...oscdata);

    let range = Math.abs(max - min);

    let logArray = logMode
      ? oscdata.map((e, i) => {
          let thisLogIndex = Math.floor(
            linearToLogScale(i + 1, 1, oscdata.length + 1) - 1
          );
          let lastLogIndex = Math.floor(
            linearToLogScale(i, 1, oscdata.length + 1)
          );

          return lastLogIndex === thisLogIndex
            ? oscdata[thisLogIndex] -
                (oscdata[thisLogIndex] - oscdata[lastLogIndex])
            : oscdata[thisLogIndex];
        })
      : oscdata;

    logArray.map((e, i) => e);

    logArray.map((e, i) => {
      ctx.lineTo(
        (i + 1) / 8,
        ((e + -min) / range) * (-canvasHeight / 2) + canvasHeight,
        1,
        1
      );
    });

    ctx.stroke();
  };

  useEffect(() => {
    return () => {
      clearInterval(animator);
    };
  }, []);

  useEffect(() => {
    clearInterval(animator);
    setAnimator(
      setInterval(() => {
        let oscdata = props.nodes[0].getValue();
        drawWave(oscdata);
      }, 16)
    );
  }, [logMode]);

  return (
    <>
      <canvas
        height="250px"
        width="512px"
        id={`analyzer-${props.module.id}`}
        style={{ imageRendering: "pixelated", pointerEvents: "none" }}
        onClick={() => setLogMode((prev) => !prev)}
      />
      <Jack type="in" index={0} module={props.module} />
    </>
  );
}

export default Analyzer;

const linearToLogScale = (value, min, max) => {
  let b = Math.log(max / min) / (max - min);
  let a = max / Math.exp(b * max);
  let tempAnswer = a * Math.exp(b * value);

  return tempAnswer;
};
