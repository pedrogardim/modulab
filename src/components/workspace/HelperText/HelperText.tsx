import { useSelector } from "@/store/hooks";

const HelperText: React.FC = () => {
  const { modules } = useSelector((state) => state.session);
  return (
    <div
      className={"fixed h-full p-16 " + (modules.length > 0 && "opacity-50")}
    >
      <h1 className="font-display text-6xl text-indigo-600">ModulAb</h1>
      <p className="font-body text-md mt-4 text-gray-600">
        Welcome to Modulab, a playground where you can play with sounds and
        signals.
        <br />
        To get started just press the + button
        <br />
        By{" "}
        <a
          className="underline text-indigo-600"
          href="https://github.com/pedrogardim"
          target="_blank"
        >
          Pedro Gardim
        </a>
      </p>
    </div>
  );
};

export default HelperText;
