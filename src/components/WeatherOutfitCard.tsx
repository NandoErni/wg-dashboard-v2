import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";


export function WeatherOutfitCard() {
  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader>
        <CardTitle>Weather & Outfit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
            <Sun className="w-12 h-full"/>
            <div className="text-lg text-muted-foreground">
                <p>It's sunny today!</p>
                <p>A T-Shirt and shorts are a good choice.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
