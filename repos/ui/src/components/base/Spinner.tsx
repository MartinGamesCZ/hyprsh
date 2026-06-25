import { PiSpinner } from "react-icons/pi";
import { TBIcon } from "./taskbar/TBIcon";

interface ISpinnerProps {
  container: typeof TBIcon;
  className?: string;
}

export function Spinner(props: ISpinnerProps) {
  return (
    <props.container
      icon={PiSpinner}
      className={`animate-spin text-ctp-lavender ${props.className}`}
    />
  );
}
