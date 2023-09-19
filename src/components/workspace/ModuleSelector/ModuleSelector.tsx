import { modulesInfo } from "../../../utils/modulesInfo";
import ModuleSelectorOption from "./ModuleSelectorOption";

import "./styles.css";

const ModuleSelector: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center bg-opacity-10 bg-black">
      <div className="w-full max-w-6xl mx-2 overflow-y-scroll shadow bg-white grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-h-1/2">
        {Object.values(modulesInfo).map((module, index) => (
          <ModuleSelectorOption module={module} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
