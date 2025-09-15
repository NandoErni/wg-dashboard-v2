import { useTranslation } from "react-i18next";
import { useNextBus } from "@/components/hooks/useNextBus";
import { useEffect, useState } from "react";

export function NextBusText() {
  const { t, i18n } = useTranslation();

  const nextBusDate = useNextBus();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  const timeInSecondsToNextBus = Math.max(
    Math.round((nextBusDate.nextBus.getTime() - now.getTime()) / 1000),
    0
  );

  return (
    <>
      {timeInSecondsToNextBus >= 3600
        ? t("dashboard.bus.nextBusInTime", {
            time: nextBusDate.nextBus.toLocaleTimeString(i18n.language, {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })
        : timeInSecondsToNextBus >= 60
        ? t("dashboard.bus.nextBusInMinutes", {
            time: Math.round(timeInSecondsToNextBus / 60),
          })
        : t("dashboard.bus.nextBusInSeconds", {
            time: timeInSecondsToNextBus,
          })}
    </>
  );
}
