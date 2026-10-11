import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Loader2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Repository } from "@/lib/repository";

const WARNING_THRESHOLD_DAYS = 5;
export const OVERDUE_THRESHOLD_DAYS = 8;

export interface CompletionPerson {
  name: string;
  avatarUrl: string;
}

interface ChoreCardProps {
  icon: any;
  user: string;
  daysUntilNextChore: number;
  additionalTrash: string;
  choreType: string;
  members: CompletionPerson[];
}

type ChoreStatus = "done" | "warning" | "overdue";

export function ChoreCard({
  icon: svgUrl,
  user,
  daysUntilNextChore,
  additionalTrash,
  choreType,
  members,
}: ChoreCardProps) {
  const [status, setStatus] = useState<ChoreStatus>("done");
  const [completionCount, setCompletionCount] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const checkStatus = useCallback(async () => {
    try {
      // 1. Fetch latest completion status
      const lastData = await Repository.getLatestChoreCompletion(choreType);

      if (lastData) {
        const lastCompletion = lastData.completionTime?.toDate() || new Date(0);
        const now = new Date();

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

      // 2. Fetch completion count for this period (Implement this method in your Repository later)
      const count = await Repository.getCompletionCountThisPeriod(choreType);
      if (typeof count === "number") {
        setCompletionCount(count);
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

  const confirmCompletion = async (selectedUser: string) => {
    try {
      setIsSubmitting(true);
      await Repository.completeChore(choreType, selectedUser);
      setStatus("done");
      setShowConfirm(false);
      // Optimistically update count or let checkStatus refresh it
      setCompletionCount((prev) => prev + 1);
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
        className={`border-0 text-center space-y-4 p-6 cursor-pointer transition-colors relative ${getCardStyles()}`}
        onClick={handleCardClick}>
        
        {/* Top-right completion counter badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold shadow-sm border border-border/40">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>x{completionCount}</span>
        </div>

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
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.chores.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.chores.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Big face buttons for apartment members */}
          <div className="grid grid-cols-3 gap-3 py-4">
            {members.map((member) => (
              <button
                key={member.name}
                onClick={() => confirmCompletion(member.name)}
                disabled={isSubmitting}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50 group shadow-sm">
                {isSubmitting ? (
                  <Loader2 className="w-12 h-12 animate-spin my-2 text-muted-foreground" />
                ) : (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-2 group-hover:border-primary shadow-sm"
                  />
                )}
                <span className="text-xs font-semibold truncate w-full text-center">
                  {member.name}
                </span>
              </button>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              {t("dashboard.chores.cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}