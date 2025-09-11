import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNextTrashPickup } from "@/components/hooks/useNextTrashPickupDate";

export function TrashCard() {
  const { t, i18n } = useTranslation();
  
  const nextTrashEvent = useNextTrashPickup("trash");
  const nextPaperEvent = useNextTrashPickup("paper");
  
  return (
    <Card className=" border-0 shadow-2xl">
      <CardHeader>
        <CardTitle>{t("dashboard.wasteCollection")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
            <Trash2 className="w-12 h-full"/>
            <div className="text-lg text-muted-foreground">
                <p>{t("dashboard.paperAndCardboard")}: {nextPaperEvent.date.toLocaleDateString(i18n.language)} ({nextPaperEvent.summary})</p>
                <p>{t("dashboard.trash")}: {nextTrashEvent.date.toLocaleDateString(i18n.language)} ({nextTrashEvent.summary})</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
