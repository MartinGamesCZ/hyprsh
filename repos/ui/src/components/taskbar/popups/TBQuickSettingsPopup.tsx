import { TBPopup } from "@/components/base/taskbar/TBPopup";
import { ForwardedRef, forwardRef, RefObject } from "react";

interface ITBQuickSettingsPopupProps {
  show: boolean;
}

export const TBQuickSettingsPopup = forwardRef(
  (props: ITBQuickSettingsPopupProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <TBPopup show={props.show}>
        <div
          ref={ref}
          className="w-80 flex h-80 bg-ctp-base absolute right-2 top-[40px] border border-ctp-surface2 rounded-xl shadow-xl"
        ></div>
      </TBPopup>
    );
  },
);
