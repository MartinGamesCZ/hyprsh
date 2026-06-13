"use client";

import { API } from "@/classes/API";
import { HyprlandEvents } from "@/classes/HyprlandEvents";
import { TBIcon } from "@/components/base/taskbar/TBIcon";
import { TBText } from "@/components/base/taskbar/TBText";
import { ITBWidgetDefinition } from "@/types/taskbar/widget";
import { ComponentType, useCallback, useEffect, useState } from "react";
import { SiFedora } from "react-icons/si";

export class TBWindowTitleWidget implements ITBWidgetDefinition {
  public readonly id: string = "window-title";

  public readonly component: ComponentType = TBWindowTitleWidgetComponent;
}

function TBWindowTitleWidgetComponent() {
  const [title, setTitle] = useState<string>("");

  const fetchTitle = useCallback(async () => {
    const result = await API.get<{ title: string }>("/v1/window/active/title");

    if ("error" in result) {
      setTitle("ERR");
      return;
    }

    setTitle(result.title ?? "");
  }, []);

  useEffect(() => {
    fetchTitle();

    const handler = HyprlandEvents.on("activewindow", () => fetchTitle());

    return () => {
      handler.off();
    };
  }, [fetchTitle]);

  return <TBText size="sm">{title}</TBText>;
}
