import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWeather } from "@/components/hooks/useWeather";
import type { ComponentType, SVGProps } from "react";

type WeatherInterpretation = {
  message: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function WeatherOutfitCard() {
  const { t } = useTranslation();
  const weather = useWeather();

  function getClothingSuggestion(temp: number): string {
    if (temp >= 25) return t("dashboard.weather.clothing.tshirt_shorts");
    if (temp >= 15) return t("dashboard.weather.clothing.light_shirt");
    if (temp >= 5) return t("dashboard.weather.clothing.sweater_jacket");
    return t("dashboard.weather.clothing.warm_clothes");
  }

  function getWeatherMessage(weatherCode: number): WeatherInterpretation {
    // Weather codes reference: https://open-meteo.com/en/docs#api_form
    if ([0, 1].includes(weatherCode))
      return { message: t("dashboard.weather.sunny"), icon: Sun }; // clear sky / mainly clear
    if ([2, 3].includes(weatherCode))
      return { message: t("dashboard.weather.cloudy"), icon: Cloud }; // partly cloudy / overcast
    if ([45, 48].includes(weatherCode))
      return { message: t("dashboard.weather.cloudy"), icon: Cloud }; // fog / depositing rime fog
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode))
      return { message: t("dashboard.weather.rainy"), icon: CloudRain }; // drizzle / rain / showers
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
      return { message: t("dashboard.weather.snow"), icon: CloudSnow }; // snow / snow showers
    if ([95, 96, 99].includes(weatherCode))
      return { message: t("dashboard.weather.rainy"), icon: CloudLightning }; // thunderstorm
    return { message: t("dashboard.weather.cloudy"), icon: Cloud }; // fallback
  }

  const message = getWeatherMessage(weather.weathercode);

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader>
        <CardTitle>{t("dashboard.weatherAndOutfit")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <message.icon className="w-12 h-full" />
          <div className="text-lg text-muted-foreground flex flex-col gap-2">
            <p>{message.message}</p>
            <p>{getClothingSuggestion(weather.temperature)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
