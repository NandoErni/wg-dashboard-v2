import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function TrashCard() {
  return (
    <Card className=" border-0 shadow-2xl">
      <CardHeader>
        <CardTitle>Waste Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
            <Trash2 className="w-12 h-full"/>
            <div className="text-lg text-muted-foreground">
                <p>Paper & Cardboard: Friday. Oct 11th</p>
                <p>Trash: Friday. Oct 11th</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
