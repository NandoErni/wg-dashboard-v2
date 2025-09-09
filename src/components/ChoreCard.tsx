import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ChoreCardProps {
  icon: any;
  user: string;
  additionalTrash?: string;
}

export function ChoreCard({ icon: svgUrl, user, additionalTrash }: ChoreCardProps) {
  const [completed, setCompleted] = useState(false);

  return (
    <Card className={`border-0 text-center space-y-4 p-6 ${!completed ? "bg-destructive" : ""}`} onClick={() => setCompleted(!completed)}>
      <div className=" flex space-x-2 text-muted-foreground">
        <Clock className="w-5 h-5" />
        <span className="text-sm font-semibold select-none">
          {23}d
        </span>
      </div>
      <CardHeader className="flex items-center justify-center">
        <div className="opacity-25 max-w-80 max-h-80 min-w-20 min-h-20">
          {svgUrl}
        </div>
      </CardHeader>

      <CardContent>
        
        <CardTitle className="text-2xl font-bold">{user}</CardTitle>
        <p className="text-sm text-muted-foreground">{additionalTrash}</p>
      </CardContent>
    </Card>
  );
}
