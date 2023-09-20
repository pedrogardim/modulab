import { modulesInfo } from "../../../utils/modulesInfo";
import { Icon } from "../../ui/Icon";

interface ModuleSelectorOptionProps {
  module: (typeof modulesInfo)[keyof typeof modulesInfo];
  index: number;
  onClick: () => void;
}

const ModuleSelectorOption: React.FC<ModuleSelectorOptionProps> = ({
  module,
  index,
  onClick,
}) => {
  return (
    <div
      className="relative module-selector-option aspect-[2/1] py-2 px-4 flex flex-col items-center justify-evenly hover:shadow-lg transition  cursor-pointer"
      onClick={onClick}
    >
      <img
        className="h-12 opacity-50 transition"
        src={`../../../../assets/images/modules/${Object.keys(modulesInfo)[
          index
        ].toLowerCase()}.png`}
        alt={Object.keys(modulesInfo)[index]}
      />
      <h2 className="font-display text-xl text-center line-clamp-1">
        {module.name.toLowerCase()}
      </h2>
      <div className="absolute h-full w-full opacity-0 hover:opacity-100 bg-black bg-opacity-20 transition-[1000] flex justify-center items-center">
        <Icon icon="plus" size={1.4} />
      </div>
      {/* <p className="font-body text-xs text-gray-500 text-center line-clamp-1">
        {module.description}
      </p> */}
    </div>
  );
};

export default ModuleSelectorOption;
