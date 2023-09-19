import { Icon } from "../../ui/Icon";
import { IconName } from "../../ui/Icon/icons";

type SideMenuAction = {
  icon: IconName;
  color?: string;
  action?: () => void;
};

const SideMenu: React.FC = () => {
  const sideMenuActions: SideMenuAction[] = [
    {
      icon: "plus",
    },
    {
      icon: "viewGridCompact",
    },
    {
      icon: "record",
      color: "red",
    },
    {
      icon: "nuke",
    },
  ];

  return (
    <div className="fixed left-0 top-0 flex flex-col gap-y-4 h-screen p-4 justify-center user-select-none">
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
