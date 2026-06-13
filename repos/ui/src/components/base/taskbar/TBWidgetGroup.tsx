import { ReactNode } from "react";

interface ITBWidgetGroupProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

export function TBWidgetGroup(props: ITBWidgetGroupProps) {
  return (
    <div className={props.className + " flex flex-row items-center gap-2"}>
      {props.children}
    </div>
  );
}
