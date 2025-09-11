import { Separator } from "@/components/ui/separator";
import { ChoreCard } from "@/components/ChoreCard";
import { PoopIcon } from "@/components/Shit";
import { BroomIcon } from "@/components/Broom";
import { CutleryIcon } from "@/components/Cutlery";
import { TrashCard } from "@/components/TrashCard";
import { WeatherOutfitCard } from "@/components/WeatherOutfitCard";

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
  return (
    <div className=" flex flex-col gap-10 text-2xl py-10 h-full">
      <div className="w-full flex text-center flex-wrap gap-x-15 gap-y-8">
        <div className="grow">Tag der Arbeit</div>
        <div className="grow">In 5min</div>
        <div className="grow">28.05.2025 16:06</div>

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
