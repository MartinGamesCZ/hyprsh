import { useEffect } from "react";
import { useWifiStore } from "../stores/useWifiStore";
import { API } from "@/classes/API";
import { useEvent } from "./useEvents";

export function useWifiModule() {
  const store = useWifiStore();
  useEvent("wifi.power", async (value: boolean) => {
    store.setPowered(value);

    if (!value) {
      store.setConnected(false);
      store.setSsid(null);
      store.setStrength(null);
    } else await fetchConnection();
  });
  useEvent("wifi.ssid", (ssid: string | null) => {
    store.setSsid(ssid);

    if (!ssid) {
      store.setConnected(false);
      store.setStrength(null);
    } else store.setConnected(true);
  });
  useEvent("wifi.strength", (strength: number | null) => {
    store.setStrength(strength);
  });

  const fetchStatus = async () => {
    const result = await API.get<{
      powered: boolean;
    }>("/v1/network/wifi/status");

    if ("error" in result) return;

    store.setPowered(result.powered);
  };

  const fetchConnection = async () => {
    const result = await API.get<{
      ssid: string;
      strength: number;
    } | null>("/v1/network/wifi/details");

    if (!result || "error" in result) {
      store.setConnected(false);
      store.setSsid(null);
      store.setStrength(null);
    } else {
      store.setConnected(true);
      store.setSsid(result.ssid);
      store.setStrength(result.strength);
    }
  };

  const initialize = async () => {
    await fetchStatus();
    await fetchConnection();

    store._setInitialized(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  return {
    _initialized: store._initialized,

    powered: store.powered,
    connected: store.connected,
    ssid: store.ssid,
    strength: store.strength,
  };
}
