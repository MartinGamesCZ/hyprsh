import { MdWifi } from "react-icons/md";
import { TBQSPCell } from "../TBQuickSettingsPopup";
import { useWifiModule } from "@/hooks/modules/useWifi";

export function TBQSPWifi() {
  const wifi = useWifiModule();

  return (
    <TBQSPCell
      icon={MdWifi}
      text={wifi.connected ? (wifi.ssid ?? "Unknown") : "Wi-Fi"}
      active={wifi.connected}
      onClick={() => (location.href = "/taskbar/popups/quick-settings/wifi")}
    />
  );
}
