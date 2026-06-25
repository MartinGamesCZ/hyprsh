import { API } from "@/classes/API";
import { TBIcon } from "@/components/base/taskbar/TBIcon";
import { useWifiModule } from "@/hooks/modules/useWifi";
import { useCallback, useEffect, useState } from "react";
import {
  MdSignalWifi0Bar,
  MdSignalWifi1Bar,
  MdSignalWifi2Bar,
  MdSignalWifi3Bar,
  MdSignalWifi4Bar,
  MdSignalWifiBad,
} from "react-icons/md";

const iconConfig = {
  disconnected: MdSignalWifiBad,
  0: MdSignalWifi0Bar,
  1: MdSignalWifi1Bar,
  2: MdSignalWifi2Bar,
  3: MdSignalWifi3Bar,
  4: MdSignalWifi4Bar,
};

export function TBQSWWifi() {
  const wifi = useWifiModule();

  const bars =
    !wifi.strength || wifi.strength < 20
      ? 0
      : wifi.strength < 40
        ? 1
        : wifi.strength < 60
          ? 2
          : wifi.strength < 80
            ? 3
            : 4;

  if (!wifi._initialized) return <></>;
  if (!wifi.powered) return <></>;
  if (!wifi.connected) return <TBIcon icon={iconConfig.disconnected} />;

  return (
    <abbr title={wifi.ssid ?? "Unknown"}>
      <TBIcon icon={iconConfig[bars]} />
    </abbr>
  );
}
