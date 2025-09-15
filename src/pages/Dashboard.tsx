import { Separator } from "@/components/ui/separator";
import { TrashCard } from "@/components/TrashCard";
import { WeatherOutfitCard } from "@/components/WeatherOutfitCard";
import Clock from "@/components/Clock";
import { useHolidayToday } from "@/components/hooks/useHolidayToday";
import { useTranslation } from "react-i18next";
import Chores from "@/components/Chores";
import { NextBusText } from "@/components/nextBusText";

export default function Dashboard() {
  const { t } = useTranslation();
  const holiday = useHolidayToday("CH");


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
          <NextBusText />  
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
