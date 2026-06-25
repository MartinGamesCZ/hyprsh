import { create } from "zustand";

export interface IWifiStore {
  _initialized: boolean;

  powered: boolean;
  connected: boolean;
  ssid: string | null;
  strength: number | null;

  _setInitialized(_initialized: boolean): void;

  setPowered(powered: boolean): void;
  setConnected(connected: boolean): void;
  setSsid(ssid: string | null): void;
  setStrength(strength: number | null): void;
}

export const useWifiStore = create<IWifiStore>((set, get) => ({
  _initialized: false,

  powered: false,
  connected: false,
  ssid: null,
  strength: null,

  _setInitialized: (_initialized: boolean) => set({ _initialized }),

  setPowered: (powered: boolean) => set({ powered }),
  setConnected: (connected: boolean) => set({ connected }),
  setSsid: (ssid: string | null) => set({ ssid }),
  setStrength: (strength: number | null) => set({ strength }),
}));
