"use client";

import { ITBWidgetDefinition } from "@/types/taskbar/widget";
import { ComponentType, useEffect, useRef, useState } from "react";
import { TBQSWWifi } from "./quick-settings/Wifi";
import { TBQSWBluetooth } from "./quick-settings/Bluetooth";
import { TBQSWBattery } from "./quick-settings/Battery";
import { TBWidgetContainer } from "@/components/base/taskbar/TBWidgetContainer";
import { TBQuickSettingsPopup } from "../popups/TBQuickSettingsPopup";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export class TBQuickSettingsWidget implements ITBWidgetDefinition {
  public readonly id: string = "quick-settings";

  public readonly component: ComponentType = TBQuickSettingsWidgetComponent;
}

function TBQuickSettingsWidgetComponent() {
  const [show, setShow] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popupRef, () => setShow(false));

  useEffect(() => {
    window.hyprsh.requestInputRegionExpand(show);
  }, [show]);

  return (
    <>
      <TBWidgetContainer onClick={() => setShow(true)}>
        <TBQSWWifi />
        <TBQSWBluetooth />
        <TBQSWBattery />
      </TBWidgetContainer>
      <TBQuickSettingsPopup ref={popupRef} show={show} />
    </>
  );
}
