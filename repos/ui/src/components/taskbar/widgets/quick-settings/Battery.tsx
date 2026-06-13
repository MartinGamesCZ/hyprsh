import { API } from "@/classes/API";
import { TBIcon } from "@/components/base/taskbar/TBIcon";
import { useCallback, useEffect, useState } from "react";
import {
  MdBattery0Bar,
  MdBattery20,
  MdBattery2Bar,
  MdBattery30,
  MdBattery50,
  MdBattery60,
  MdBattery80,
  MdBattery90,
  MdBatteryAlert,
  MdBatteryCharging20,
  MdBatteryCharging30,
  MdBatteryCharging50,
  MdBatteryCharging60,
  MdBatteryCharging80,
  MdBatteryCharging90,
  MdBatteryChargingFull,
  MdBatteryFull,
  MdBatteryStd,
  MdBolt,
  MdCable,
  MdPower,
} from "react-icons/md";

const iconConfig = {
  0: MdBattery0Bar,
  20: MdBattery20,
  30: MdBattery30,
  50: MdBattery50,
  60: MdBattery60,
  80: MdBattery80,
  90: MdBattery90,
  100: MdBatteryFull,
  ch0: MdPower,
  ch20: MdBatteryCharging20,
  ch30: MdBatteryCharging30,
  ch50: MdBatteryCharging50,
  ch60: MdBatteryCharging60,
  ch80: MdBatteryCharging80,
  ch90: MdBatteryCharging90,
  ch100: MdBatteryChargingFull,
};

export function TBQSWBattery() {
  const [charging, setCharging] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const fetchDetails = useCallback(async () => {
    const result = await API.get<{
      state: string;
      percentage: number;
    }>("/v1/power/battery/BAT0/stats");

    if (!result || "error" in result) {
      setCharging(false);
      setPercentage(0);

      return;
    }

    setCharging(result.state == "charging");
    setPercentage(result.percentage);
  }, []);

  useEffect(() => {
    fetchDetails();

    const i = setInterval(() => {
      fetchDetails();
    }, 1000);

    return () => clearInterval(i);
  }, [fetchDetails]);

  // TODO: Refactor - I am going to sleep (really, I am lazy)
  const icon = charging
    ? percentage == 100
      ? iconConfig.ch100
      : percentage >= 90
        ? iconConfig.ch90
        : percentage >= 80
          ? iconConfig.ch80
          : percentage >= 60
            ? iconConfig.ch60
            : percentage >= 50
              ? iconConfig.ch50
              : percentage >= 30
                ? iconConfig.ch30
                : percentage >= 20
                  ? iconConfig.ch20
                  : iconConfig.ch0
    : percentage >= 100
      ? iconConfig[100]
      : percentage >= 90
        ? iconConfig[90]
        : percentage >= 80
          ? iconConfig[80]
          : percentage >= 60
            ? iconConfig[60]
            : percentage >= 50
              ? iconConfig[50]
              : percentage >= 30
                ? iconConfig[30]
                : percentage >= 20
                  ? iconConfig[20]
                  : iconConfig[0];

  return <TBIcon icon={icon} />;
}
