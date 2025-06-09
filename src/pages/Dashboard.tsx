// src/pages/Dashboard.tsx
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ClipboardList, Trash2, Camera, CloudSun } from "lucide-react";
import { Link } from "react-router-dom";

const dashboardItems = [
  {
    label: "Calendar",
    icon: <CalendarDays className="w-6 h-6" />,
    to: "/calendar",
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "To-Do List",
    icon: <ClipboardList className="w-6 h-6" />,
    to: "/todo",
    color: "bg-green-100 text-green-800",
  },
  {
    label: "Garbage Alerts",
    icon: <Trash2 className="w-6 h-6" />,
    to: "/garbage",
    color: "bg-red-100 text-red-800",
  },
  {
    label: "Photo Booth",
    icon: <Camera className="w-6 h-6" />,
    to: "/photo",
    color: "bg-pink-100 text-pink-800",
  },
  {
    label: "Weather & Outfit",
    icon: <CloudSun className="w-6 h-6" />,
    to: "/weather",
    color: "bg-yellow-100 text-yellow-800",
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {dashboardItems.map((item) => (
        <Link to={item.to} key={item.to}>
          <Card className="cursor-pointer hover:shadow-lg transition duration-200">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className={`p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-lg font-semibold">{item.label}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
