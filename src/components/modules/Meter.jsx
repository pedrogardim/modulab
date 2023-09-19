import { useState, useEffect } from "react";
import { Jack } from "../ui/Jack";

function Meter(props) {
  const [animator, setAnimator] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    clearInterval(animator);
    setAnimator(
      setInterval(() => {
        setValue(props.nodes[0].getValue());
      }, 16)
    );
  }, []);

  return (
    <>
      <span style={{ fontSize: 40 }}>{value.toFixed(2)}</span>
      <div className="break" />
      <Jack type="in" label="in" index={0} module={props.module} />
    </>
  );
}

export default Meter;
