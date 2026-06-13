"use client";

import { TBShell } from "@/components/base/taskbar/TBShell";
import { TBWidget } from "@/components/base/taskbar/TBWidget";
import { TBWidgetGroup } from "@/components/base/taskbar/TBWidgetGroup";
import { TBClockWidget } from "@/components/taskbar/widgets/TBClockWidget";
import { TBOsIconWidget } from "@/components/taskbar/widgets/TBOsIconWidget";
import { TBQuickSettingsWidget } from "@/components/taskbar/widgets/TBQuickSettingsWidget";
import { TBWindowTitleWidget } from "@/components/taskbar/widgets/TBWindowTitleWidget";

export default function Page() {
  return (
    <TBShell
      widgets={[
        TBClockWidget,
        TBOsIconWidget,
        TBWindowTitleWidget,
        TBQuickSettingsWidget,
      ]}
    >
      <TBWidgetGroup className="gap-4">
        <TBWidget id="os-icon" />
        <TBWidget id="window-title" />
      </TBWidgetGroup>
      <TBWidgetGroup className="gap-[1px]">
        <TBWidget id="quick-settings" />
        <TBWidget id="clock" />
      </TBWidgetGroup>
    </TBShell>
  );
}
