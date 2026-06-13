import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ITBPopupProps {
  children: ReactNode | ReactNode[];
  show: boolean;
}

export function TBPopup(props: ITBPopupProps) {
  if (typeof document == "undefined") return <></>;

  return createPortal(props.show && <>{props.children}</>, document.body);
}
