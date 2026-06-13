"use client";

import { TBQSPWifi } from "@/components/taskbar/popups/quick-settings/Wifi";

export default function Page() {
  return (
    <div className="w-80 grid grid-cols-2 gap-2 p-2" id="popup-shell">
      <TBQSPWifi />
    </div>
  );
}
