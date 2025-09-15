import { Separator } from "@/components/ui/separator";
import { TrashCard } from "@/components/TrashCard";
import { WeatherOutfitCard } from "@/components/WeatherOutfitCard";
import Clock from "@/components/Clock";
import { useHolidayToday } from "@/components/hooks/useHolidayToday";
import { useTranslation } from "react-i18next";
import { useNextBus } from "@/components/hooks/useNextBus";
import Chores from "@/components/Chores";

export default function Dashboard() {
  const { i18n, t } = useTranslation();
  const holiday = useHolidayToday("CH");
  const nextBusDate = useNextBus();

  const timeInSecondsToNextBus = Math.max(
    Math.round((nextBusDate.nextBus.getTime() - new Date().getTime()) / 1000),
    0
  );

  return (
    <div className=" flex flex-col gap-10 text-2xl py-10 h-full">
      <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 text-center items-center">
        <div className="">
          {holiday ? holiday.localName : t("dashboard.noHoliday")}
        </div>
        {/* <div className="grow">In 5min</div> */}
        <div className="text-7xl">
          <Clock config="time" />
        </div>
        <div>
          <Clock config="date" />
        </div>
        <p className="text-base lg:col-2">
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
        </p>
      </div>
      <Separator />
      <div className="grid md:grid-cols-3 gap-4">
        <Chores />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-auto">
        <TrashCard />
        <WeatherOutfitCard />
      </div>
    </div>
  );
}
