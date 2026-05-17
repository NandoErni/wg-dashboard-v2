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

const WARNING_THRESHOLD_DAYS = 5;
export const OVERDUE_THRESHOLD_DAYS = 8;

interface ChoreCardProps {
  icon: any;
  user: string;
  daysUntilNextChore: number;
  additionalTrash: string;
  choreType: string;
}

type ChoreStatus = "done" | "warning" | "overdue";

export function ChoreCard({
  icon: svgUrl,
  user,
  daysUntilNextChore,
  additionalTrash,
  choreType,
}: ChoreCardProps) {
  const [status, setStatus] = useState<ChoreStatus>("done");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const checkStatus = useCallback(async () => {
    try {
      const lastData = await Repository.getLatestChoreCompletion(choreType);

      if (lastData) {
        const lastCompletion = lastData.completionTime?.toDate() || new Date(0);
        const now = new Date();

        // Calculate differences in milliseconds converted to days
        const diffTime = Math.abs(now.getTime() - lastCompletion.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= OVERDUE_THRESHOLD_DAYS) {
          setStatus("overdue");
        } else if (diffDays >= WARNING_THRESHOLD_DAYS) {
          setStatus("warning");
        } else {
          setStatus("done");
        }
      } else {
        setStatus("overdue");
      }
    } catch (err) {
      console.error("Error fetching chore status:", err);
    }
  }, [choreType]);

  useEffect(() => {
    checkStatus();

    const intervalId = setInterval(() => {
      checkStatus();
    }, 20_000);

    return () => clearInterval(intervalId);
  }, [checkStatus]);

  const handleCardClick = () => {
    if (status !== "done") {
      setShowConfirm(true);
    } else {
      toast.info(t("dashboard.chores.alreadyDone"));
    }
  };

  const confirmCompletion = async () => {
    try {
      setIsSubmitting(true);
      await Repository.completeChore(choreType, user);
      setStatus("done");
      setShowConfirm(false);
      toast.success(t("dashboard.chores.completedSuccess"));
    } catch (error) {
      toast.error(t("dashboard.chores.completedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardStyles = () => {
    switch (status) {
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "done":
      default:
        return "bg-card text-card-foreground";
    }
  };

  return (
    <>
      <Card
        className={`border-0 text-center space-y-4 p-6 cursor-pointer transition-colors ${getCardStyles()}`}
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
              status === "done" ? "text-muted-foreground" : "opacity-80"
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
