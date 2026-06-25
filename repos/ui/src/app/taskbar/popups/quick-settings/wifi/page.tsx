"use client";

import { API } from "@/classes/API";
import { Spinner } from "@/components/base/Spinner";
import { TBIcon } from "@/components/base/taskbar/TBIcon";
import { TBText } from "@/components/base/taskbar/TBText";
import { Toggle } from "@/components/base/Toggle";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MdArrowBack,
  MdArrowRight,
  MdCheck,
  MdRunCircle,
  MdSignalWifi0Bar,
  MdSignalWifi1Bar,
  MdSignalWifi1BarLock,
  MdSignalWifi2Bar,
  MdSignalWifi2BarLock,
  MdSignalWifi3Bar,
  MdSignalWifi3BarLock,
  MdSignalWifi4Bar,
  MdSignalWifi4BarLock,
  MdWifi,
  MdWifi1Bar,
  MdWifiLock,
} from "react-icons/md";
import { PiCheck, PiSpinner } from "react-icons/pi";

interface IWifiNetworkInfo {
  ssid: string;
  signal: number;
  open: boolean;
  active: boolean;
}

interface IWifiStatus {
  powered: boolean;
}

export default function Page() {
  const [toggleValue, setToggleValue] = useState(false);
  const [connectingTo, setConnectingTo] = useState("");

  const [networks, setNetworks] = useState<IWifiNetworkInfo[] | null>(null);

  const fetchStatus = useCallback(async () => {
    const result = await API.get<IWifiStatus>("/v1/network/wifi/status");
    if ("error" in result) {
      setToggleValue(false);
      setNetworks(null);
      return;
    }

    setToggleValue(result.powered);
  }, []);

  const fetchNetworks = useCallback(async () => {
    const result = await API.get<IWifiNetworkInfo[]>(
      "/v1/network/wifi/list?rescan=true",
    );
    if ("error" in result) {
      setNetworks([]);
      return;
    }

    setNetworks(result);
  }, []);

  const togglePower = useCallback(
    async (enabled: boolean) => {
      await API.post<
        void,
        {
          enabled: boolean;
        }
      >("/v1/network/wifi/power", { enabled: enabled });

      await fetchStatus();
      await fetchNetworks();
    },
    [fetchStatus, fetchNetworks],
  );

  const connect = useCallback(
    async (ssid: string) => {
      setConnectingTo(ssid);

      await API.post<
        void,
        {
          ssid: string;
        }
      >("/v1/network/wifi/connect", {
        ssid: ssid,
      });

      await fetchStatus();
      await fetchNetworks();
      setConnectingTo("");
    },
    [fetchNetworks],
  );

  useEffect(() => {
    (async () => {
      await fetchStatus();
      await fetchNetworks();
    })();

    const i = setInterval(async () => {
      await fetchStatus();
      await fetchNetworks();
    }, 5000);

    return () => clearInterval(i);
  }, [fetchNetworks, fetchStatus]);

  return (
    <div
      className="w-80 flex flex-col py-4 h-100 overflow-hidden"
      id="popup-shell"
    >
      <div className="flex flex-row gap-2 px-4 items-center h-6 pb-2">
        <Link href="/taskbar/popups/quick-settings" replace className="mr-2">
          <TBIcon icon={MdArrowBack} />
        </Link>
        <TBIcon icon={MdWifi} />
        <TBText className="font-semibold text-ctp-lavender">Wi-Fi</TBText>
        <Toggle
          className="ml-auto"
          value={toggleValue}
          onToggle={() => togglePower(!toggleValue)}
        />
      </div>
      {networks ? (
        <div className="w-full pt-2 flex flex-col gap-px px-2 h-94 max-h-94 overflow-auto">
          {networks
            .sort((a, b) => (a.signal > b.signal ? -1 : 1))
            .map((w) => {
              const bars =
                w.signal < 20
                  ? 0
                  : w.signal < 40
                    ? 1
                    : w.signal < 60
                      ? 2
                      : w.signal < 80
                        ? 3
                        : 4;

              const iconConfig = {
                secure: {
                  0: MdSignalWifi0Bar,
                  1: MdSignalWifi1BarLock,
                  2: MdSignalWifi2BarLock,
                  3: MdSignalWifi3BarLock,
                  4: MdSignalWifi4BarLock,
                },
                normal: {
                  0: MdSignalWifi0Bar,
                  1: MdSignalWifi1Bar,
                  2: MdSignalWifi2Bar,
                  3: MdSignalWifi3Bar,
                  4: MdSignalWifi4Bar,
                },
              };

              return (
                <div
                  key={w.ssid}
                  className="w-full flex flex-row gap-2 items-center px-2 py-1 hover:bg-ctp-surface0/50 rounded-sm transition-colors duration-200 cursor-pointer"
                  onClick={() => connect(w.ssid)}
                >
                  <TBIcon
                    icon={iconConfig[!w.open ? "secure" : "normal"][bars]}
                  />
                  <TBText>{w.ssid}</TBText>
                  {w.active && (
                    <TBIcon
                      icon={MdCheck}
                      className="text-ctp-lavender ml-auto"
                    />
                  )}
                  {connectingTo == w.ssid && (
                    <Spinner container={TBIcon} className="ml-auto" />
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner container={TBIcon} className="size-8" />
        </div>
      )}
    </div>
  );
}
