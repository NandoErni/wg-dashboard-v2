import { Separator } from "@/components/ui/separator";
import { ChoreCard } from "@/components/ChoreCard";
import { PoopIcon } from "@/components/Shit";
import { BroomIcon } from "@/components/Broom";
import { CutleryIcon } from "@/components/Cutlery";

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
    <div className="p-4 flex flex-col gap-10">
      <h1 className="text-6xl font-semibold text-foreground text-center">Weegee Board</h1>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {dashboardItems.map((item) => (
         <ChoreCard
            icon={item.icon}
            user={item.name}
            additionalTrash={item.trashchore}
            key={item.name}
            />
        ))}
      </div>
    </div>
  );
}
