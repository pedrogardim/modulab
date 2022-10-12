import React from "react";

function Connection(props) {
  const gravity = 150;

  const { connection, drawing, remove, isDeleting } = props;

  if (!connection || typeof connection.module !== "number") return <></>;

  const jackElements = [
    document.getElementById(`jack-${connection.module}-${connection.index}`)
      .children[0],
    drawing && !connection.target
      ? document.getElementById("cursor-pixel")
      : document.getElementById(
          `jack-${connection.target.module}-${connection.target.index}`
        ).children[0],
  ];

  const points = jackElements.map((e) => [
    e.getBoundingClientRect().top,
    e.getBoundingClientRect().left,
  ]);

  const attrib = {
    height: Math.abs(points[0][0] - points[1][0]) + 1,
    width: Math.abs(points[0][1] - points[1][1]) + 1,
    x: points[0][1] < points[1][1] ? points[0][1] : points[1][1],
    y: points[0][0] < points[1][0] ? points[0][0] : points[1][0],
    xInv: points[0][1] < points[1][1],
    yInv: points[0][0] < points[1][0],
  };

  const curvePoints = {
    0: `${attrib.xInv ? 0 : attrib.width} ${attrib.yInv ? 0 : attrib.height}`,
    1: `${attrib.xInv ? 0 : attrib.width} ${attrib.height + gravity}`,
    2: `${!attrib.xInv ? 0 : attrib.width} ${attrib.height + gravity}`,
    3: `${!attrib.xInv ? 0 : attrib.width} ${!attrib.yInv ? 0 : attrib.height}`,
  };

  return (
    <svg
      height={attrib.height}
      width={attrib.width}
      onClick={remove}
      className={isDeleting && "ws-deleting-line"}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${attrib.x}px,${attrib.y}px)`,
        overflow: "visible",
        boxShadow: "0px -0px 10000px transparent",
        pointerEvents: !isDeleting && "none",
      }}
    >
      <path
        d={`M ${curvePoints[0]} C ${curvePoints[1]}, ${curvePoints[2]}, ${curvePoints[3]}`}
        stroke={connection.color}
        fill="transparent"
        strokeWidth="3px"
      />
      <circle
        cx={curvePoints[0].split(" ")[0]}
        cy={curvePoints[0].split(" ")[1]}
        r={5}
        fill={connection.color}
      />
      <circle
        cx={curvePoints[3].split(" ")[0]}
        cy={curvePoints[3].split(" ")[1]}
        r={5}
        fill={connection.color}
      />
    </svg>
  );
}

export default Connection;
