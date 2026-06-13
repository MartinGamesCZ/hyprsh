import { ReactNode } from "react";

interface ITBWidgetContainerProps {
  children: ReactNode | ReactNode[];
  onClick?: () => void;
}

export function TBWidgetContainer(props: ITBWidgetContainerProps) {
  return (
    <div
      className="flex flex-row gap-2 items-center hover:bg-ctp-surface0 px-2 h-[32px] rounded-md cursor-pointer transition-colors duration-200"
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
