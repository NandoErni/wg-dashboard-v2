import { useState, useEffect, useCallback } from "react";
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
import { Clock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Repository } from "@/lib/repository";

interface ChoreCardProps {
  icon: any;
  user: string;
  daysUntilNextChore: number;
  additionalTrash: string;
  choreType: string;
}

export function ChoreCard({
  icon: svgUrl,
  user,
  daysUntilNextChore,
  additionalTrash,
  choreType,
}: ChoreCardProps) {
  const [completed, setCompleted] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const checkStatus = useCallback(async () => {
    try {
      const lastData = await Repository.getLatestChoreCompletion(choreType);

      if (lastData) {
        const lastCompletion = lastData.completionTime?.toDate() || new Date(0);
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

        if (lastCompletion < fourDaysAgo) {
          setCompleted(false);
        } else {
          setCompleted(true);
        }
      } else {
        setCompleted(false);
      }
    } catch (err) {
      console.error("Error fetching chore status:", err);
    }
  }, [choreType]);

  useEffect(() => {
    checkStatus();

    // Set up interval for background updates
    const intervalId = setInterval(() => {
      checkStatus();
    }, 20000); // 20 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = () => {
    if (!completed) {
      setShowConfirm(true);
    } else {
      toast.info(t("dashboard.chores.alreadyDone"));
    }
  };

  const confirmCompletion = async () => {
    try {
      setIsSubmitting(true);
      await Repository.completeChore(choreType, user);
      setCompleted(true);
      setShowConfirm(false);
      toast.success(t("dashboard.chores.completedSuccess"));
    } catch (error) {
      toast.error(t("dashboard.chores.completedError"));
    } finally {
      setIsSubmitting(false);
    }
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
            className={`text-sm ${
              completed
                ? "text-muted-foreground"
                : "text-destructive-foreground/80"
            }`}>
            {additionalTrash}
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.chores.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.chores.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              {t("dashboard.chores.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmCompletion();
              }}
              disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {t("dashboard.chores.complete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
