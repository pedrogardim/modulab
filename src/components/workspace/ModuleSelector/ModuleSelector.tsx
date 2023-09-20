import { useDispatch } from "@/store/hooks";
import { toggleModuleSelector } from "@/store/uiSlice";
import { modulesInfo } from "@/utils/modulesInfo";
import ModuleSelectorOption from "./ModuleSelectorOption";
import { useSession } from "@/context/SessionContext";

import "./styles.css";

const ModuleSelector: React.FC = () => {
  const dispatch = useDispatch();

  const { addModule } = useSession();

  const close = () => dispatch(toggleModuleSelector());

  const handleAddModule = (moduleType: string) => {
    addModule(moduleType);
    close();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center z-20">
      <div
        className="fixed h-full w-full bg-opacity-10 bg-black"
        onClick={close}
      ></div>
      <div className="w-full max-w-6xl mx-2 overflow-y-scroll shadow bg-white grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-h-1/2">
        {Object.keys(modulesInfo).map((module, index) => (
          <ModuleSelectorOption
            key={module}
            module={modulesInfo[module]}
            index={index}
            onClick={() => handleAddModule(module)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
