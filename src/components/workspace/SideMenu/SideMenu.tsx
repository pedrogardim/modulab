import { useDispatch, useSelector } from "@/store/hooks";
import {
  toggleConnectionMatrix,
  toggleModuleSelector,
  toggleIsRecording,
} from "@/store/uiSlice";

import { Icon } from "../../ui/Icon";
import { IconName } from "../../ui/Icon/icons";

type SideMenuAction = {
  icon: IconName;
  color?: string;
  action?: () => void;
};

const SideMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { isRecording } = useSelector((state) => state.ui);

  const sideMenuActions: SideMenuAction[] = [
    {
      icon: "plus",
      action: () => dispatch(toggleModuleSelector()),
    },
    {
      icon: "viewGridCompact",
      action: () => dispatch(toggleConnectionMatrix()),
    },
    {
      icon: "record",
      color: isRecording ? "red" : "black",
      action: () => dispatch(toggleIsRecording()),
    },
    {
      icon: "nuke",
      action: () => console.log("TODO: remove all"),
    },
  ];

  return (
    <div className="fixed left-0 top-0 flex flex-col gap-y-4 h-screen p-4 justify-center user-select-none z-10 bg-transparent">
      {sideMenuActions.map((option) => (
        <div onClick={option.action}>
          <Icon
            className="hover:brightness-200 active:brightness-75 cursor-pointer"
            icon={option.icon}
            size={1}
            color={option.color || "#555"}
          />
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
