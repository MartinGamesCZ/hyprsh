import { IconType } from "react-icons";

interface ITBIconProps {
  icon: IconType;
  className?: string;
}

export function TBIcon(props: ITBIconProps) {
  return (
    <props.icon
      className={`size-4 ${props.className || "text-ctp-lavender"}`}
    />
  );
}
