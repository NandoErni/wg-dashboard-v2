import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TrashCard } from "@/components/trashCard";
import { WeatherOutfitCard } from "@/components/weatherOutfitCard";
import Clock from "@/components/clock";
import { useHolidayToday } from "@/components/hooks/useHolidayToday";
import { useTranslation } from "react-i18next";
import Chores from "@/components/chores";
import { NextBusText } from "@/components/nextBusText";
import { JokeDialog } from "@/components/jokeDialog";
import { appConfig } from "@/config/app-config";

export default function Dashboard() {
  const { t } = useTranslation();
  const holiday = useHolidayToday(appConfig.dashboard.holidayCountry);
  const [jokeOpen, setJokeOpen] = useState(false);

  const showTrashCard = appConfig.dashboard.cards.trash;
  const showWeatherCard = appConfig.dashboard.cards.weatherOutfit;

  return (
    <div className="min-h-full flex flex-col gap-10 text-2xl py-10">
      <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 text-center items-center">
        <div>{holiday ? holiday.localName : t("dashboard.noHoliday")}</div>

        <div
          className="text-5xl lg:text-5xl xl:text-7xl text-center cursor-pointer hover:scale-105 transition-transform active:opacity-70"
          onClick={() => setJokeOpen(true)}>
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

      <JokeDialog isOpen={jokeOpen} setIsOpen={setJokeOpen} />

      {(showTrashCard || showWeatherCard) && (
        <div className="grid md:grid-cols-2 gap-4 mt-auto">
          {showTrashCard && <TrashCard />}
          {showWeatherCard && <WeatherOutfitCard />}
        </div>
      )}
    </div>
  );
}