import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ClipboardList, Trash2, Camera, CloudSun } from "lucide-react";
import { Link } from "react-router-dom";

const dashboardItems = [
  {
    label: "Calendar",
    icon: <CalendarDays className="w-6 h-6" />,
    to: "/calendar",
  },
  {
    label: "To-Do List",
    icon: <ClipboardList className="w-6 h-6" />,
    to: "/todo",
  },
  {
    label: "Garbage Alerts",
    icon: <Trash2 className="w-6 h-6" />,
    to: "/garbage",
  },
  {
    label: "Photo Booth",
    icon: <Camera className="w-6 h-6" />,
    to: "/photo",
  },
  {
    label: "Weather & Outfit",
    icon: <CloudSun className="w-6 h-6" />,
    to: "/weather",
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 flex flex-col gap-10">
      <h1 className="text-6xl font-semibold text-foreground text-center">Weegee Board</h1>
      <Separator />
      {dashboardItems.map((item) => (
        <Link to={item.to} key={item.to}>
          <Card className="cursor-pointer hover:shadow-lg">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className={`p-3 rounded-full`}>
                {item.icon}
              </div>
              <div className="text-lg font-semibold">{item.label}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Separator />
      <div></div>
      
    </div>
  );
}
