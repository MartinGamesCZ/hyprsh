import { TBPopup } from "@/components/base/taskbar/TBPopup";
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { TBQSPWifi } from "./quick-settings/Wifi";
import { TBIcon } from "@/components/base/taskbar/TBIcon";
import { MdWifi } from "react-icons/md";
import { TBText } from "@/components/base/taskbar/TBText";
import { IconType } from "react-icons";

interface ITBQuickSettingsPopupProps {
  show: boolean;
}

export const TBQuickSettingsPopup = forwardRef(
  (props: ITBQuickSettingsPopupProps, ref: ForwardedRef<HTMLDivElement>) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = useState("0px");

    const onLoad = useCallback(() => {
      const obs = new ResizeObserver(() => {
        const h =
          iframeRef.current?.contentWindow?.document.body.querySelector(
            "#popup-shell",
          )?.scrollHeight;
        if (h) setHeight(`${h}px`);
      });

      obs.observe(
        iframeRef.current?.contentWindow?.document.body.querySelector(
          "#popup-shell",
        )!,
      );

      return () => obs.disconnect();
    }, [iframeRef]);

    return (
      <TBPopup show={props.show}>
        <div
          ref={ref}
          className="w-80 bg-ctp-base absolute right-2 top-[40px] border border-ctp-surface2 rounded-xl shadow-xl"
        >
          <iframe
            src="/taskbar/popups/quick-settings"
            className="w-80 col-span-full"
            frameBorder={0}
            onLoad={onLoad}
            onLoadStart={() => setHeight("0px")}
            scrolling="no"
            width={"100%"}
            height={height}
            ref={iframeRef}
          />
        </div>
      </TBPopup>
    );
  },
);

interface ITBQSPCellProps {
  icon: IconType;
  text: string;
  active: boolean;
  onClick: () => void;
}

export function TBQSPCell(props: ITBQSPCellProps) {
  const styles = {
    active: "bg-ctp-lavender hover:bg-ctp-lavender/80",
    normal: "bg-ctp-crust hover:bg-ctp-crust/80",
  };

  return (
    <div
      className={`grow h-14 p-2 ${styles[props.active ? "active" : "normal"]} rounded-md items-center flex flex-row gap-2 px-4 cursor-pointer transition-colors duration-200`}
      onClick={props.onClick}
    >
      <TBIcon
        className={props.active ? "text-ctp-base" : "text-ctp-lavender"}
        icon={props.icon}
      />
      <TBText
        className={`${props.active ? "text-ctp-base" : "text-ctp-lavender"} truncate flex-1 min-w-0`}
      >
        {props.text}
      </TBText>
    </div>
  );
}
