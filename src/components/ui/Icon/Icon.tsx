import { useEffect, useState } from "react";
import MDIIcon from "@mdi/react";
import { IconProps as MDIIconProps } from "@mdi/react/dist/IconProps";
import { IconName } from "./icons";

interface IconProps extends Omit<MDIIconProps, "path"> {
  icon: IconName;
  path?: string;
}

const Icon: React.FC<IconProps> = (props) => {
  const { icon } = props;
  const [iconPath, setIconPath] = useState<string | null>(null);

  useEffect(() => {
    const loadIcon = async (iconName: IconName) => {
      const iconPathName = `mdi${
        iconName.charAt(0).toUpperCase() + iconName.slice(1)
      }`;

      const icons: Record<string, string> = await import("./icons");

      setIconPath(icons[iconPathName]);
    };
    loadIcon(icon);
  }, [icon]);

  if (!iconPath) return null;

  return <MDIIcon {...props} path={iconPath} />;
};

export default Icon;
