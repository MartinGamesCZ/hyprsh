import { MdWifi } from "react-icons/md";
import { TBQSPCell } from "../TBQuickSettingsPopup";
import { useCallback, useEffect, useState } from "react";
import { API } from "@/classes/API";

export function TBQSPWifi() {
  const [connected, setConnected] = useState(false);
  const [ssid, setSsid] = useState("");

  const fetchDetails = useCallback(async () => {
    const result = await API.get<{
      ssid: string;
      strength: number;
    } | null>("/v1/network/wifi/details");

    if (!result || "error" in result) {
      setConnected(false);
      setSsid("");

      return;
    }

    setSsid(result.ssid);
    setConnected(true);
  }, []);

  useEffect(() => {
    fetchDetails();

    const i = setInterval(() => {
      fetchDetails();
    }, 5000);

    return () => clearInterval(i);
  }, [fetchDetails]);

  return (
    <TBQSPCell
      icon={MdWifi}
      text={connected ? ssid : "Wi-Fi"}
      active={connected}
      onClick={() => (location.href = "/taskbar/popups/quick-settings/wifi")}
    />
  );
}
