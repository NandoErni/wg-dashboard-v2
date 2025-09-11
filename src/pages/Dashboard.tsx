import { Separator } from "@/components/ui/separator";
import { ChoreCard } from "@/components/ui/ChoreCard";
import { PoopIcon } from "@/components/svg/Shit";
import { BroomIcon } from "@/components/svg/Broom";
import { CutleryIcon } from "@/components/svg/Cutlery";
import { TrashCard } from "@/components/ui/TrashCard";
import { WeatherOutfitCard } from "@/components/ui/WeatherOutfitCard";
import Clock from "@/components/Clock";
import { useHolidayToday } from "@/components/hooks/useHolidayToday";
import { useTranslation } from "react-i18next";

const dashboardItems = [
  {
    icon: <PoopIcon />,
    name: "Nando",
    trashchore: "Cleaning the bathroom was never that easy",
  },
  {
    icon: <CutleryIcon />,
    name: "Timon",
    trashchore: "Kitchen garbage",
  },
  {
    icon:<BroomIcon />,
    name: "Michelle",
    trashchore: "Mopping floor",
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const holiday = useHolidayToday("CH");

  return (
    <div className=" flex flex-col gap-10 text-2xl py-10 h-full">
      <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 text-center  items-center">
        <div className="">{holiday ? holiday.localName : t("dashboard.noHoliday")}</div>
        {/* <div className="grow">In 5min</div> */}
        <div className=" text-7xl"><Clock config="time" /></div>
        <div className=""><Clock config="date"/></div>

      </div>
      <Separator />
      <div className="grid md:grid-cols-3 gap-4">
        {dashboardItems.map((item) => (
         <ChoreCard
            icon={item.icon}
            user={item.name}
            additionalTrash={item.trashchore}
            key={item.name}
            />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-auto">
        <TrashCard />
        <WeatherOutfitCard />
      </div>
    </div>
  );
}
