function HelperText() {
  return (
    <div className="h-full p-4">
      <h1 className="font-display text-6xl">ModulAb</h1>
      <p className="font-body text-md mt-4">
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
}

export default HelperText;
