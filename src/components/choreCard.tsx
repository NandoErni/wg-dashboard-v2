import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChoreCardProps {
  icon: any;
  user: string;
  daysUntilNextChore: number;
  additionalTrash?: string;
}

export function ChoreCard({
  icon: svgUrl,
  user,
  daysUntilNextChore,
  additionalTrash,
}: ChoreCardProps) {
  const [completed, setCompleted] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  const handleCardClick = () => {
    if (completed) {
      // If already green/completed, we toggle back to incomplete immediately
      setCompleted(false);
    } else {
      // If incomplete (red), open the confirmation popup
      setShowConfirm(true);
    }
  };

  const confirmCompletion = () => {
    setCompleted(true);
    setShowConfirm(false);
  };

  return (
    <>
      <Card
        className={`border-0 text-center space-y-4 p-6 cursor-pointer transition-colors ${
          !completed ? "bg-destructive text-destructive-foreground" : ""
        }`}
        onClick={handleCardClick}>
        <div className="flex space-x-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-semibold select-none">
            {t("dashboard.chores.days", { count: daysUntilNextChore })}
          </span>
        </div>
        <CardHeader className="flex items-center justify-center p-0">
          <div className="opacity-50 max-w-80 max-h-80 min-w-20 min-h-20">
            {svgUrl}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <CardTitle className="text-2xl font-bold">{user}</CardTitle>
          <p
            className={`text-sm ${completed ? "text-muted-foreground" : "text-destructive-foreground/80"}`}>
            {additionalTrash}
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Confirm Completion")}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you have finished this chore? This will mark it as
              done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompletion}>
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
