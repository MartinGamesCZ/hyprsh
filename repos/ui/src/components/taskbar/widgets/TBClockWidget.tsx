"use client";

import { TBText } from "@/components/base/taskbar/TBText";
import { TBWidgetContainer } from "@/components/base/taskbar/TBWidgetContainer";
import { ITBWidgetDefinition } from "@/types/taskbar/widget";
import { ComponentType, useEffect, useState } from "react";

export class TBClockWidget implements ITBWidgetDefinition {
  public readonly id: string = "clock";

  public readonly component: ComponentType = TBClockWidgetComponent;
}

function TBClockWidgetComponent() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const date = new Date();
      setTime(
        `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
      );
    };

    update();

    const i = setInterval(update, 1000);

    return () => clearInterval(i);
  }, []);

  return (
    <TBWidgetContainer>
      <TBText size="sm">{time}</TBText>
    </TBWidgetContainer>
  );
}
