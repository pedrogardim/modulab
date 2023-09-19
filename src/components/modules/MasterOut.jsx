import { Jack } from "../ui/Jack";

function MasterOut(props) {
  return (
    <>
      <Jack type="in" index={0} module={props.module} />
    </>
  );
}

export default MasterOut;
