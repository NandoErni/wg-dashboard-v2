import { useState, useEffect } from "react";
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
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { toast } from "sonner";

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

  useEffect(() => {
    const checkStatus = async () => {
      try {
        //await EnsureLogin();
        const q = query(
          collection(db, "chore_completions"),
          where("choreType", "==", choreType),
          orderBy("completionTime", "desc"),
          limit(1),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const lastData = querySnapshot.docs[0].data();
          const lastCompletion =
            lastData.completionTime?.toDate() || new Date(0);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (lastCompletion < oneWeekAgo) {
            setCompleted(false);
          }
        } else {
          setCompleted(false);
        }
      } catch (err) {
        console.error("Error fetching chore status:", err);
      }
    };
    checkStatus();
  }, [choreType]);

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
      await addDoc(collection(db, "chore_completions"), {
        choreType: choreType,
        completedBy: user,
        completionTime: serverTimestamp(),
      });

      setCompleted(true);
      setShowConfirm(false);
      toast.success(t("dashboard.chores.completedSuccess"));
    } catch (error) {
      console.error("Error saving chore completion:", error);
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
            className={`text-sm ${completed ? "text-muted-foreground" : "text-destructive-foreground/80"}`}>
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
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {t("dashboard.chores.complete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
