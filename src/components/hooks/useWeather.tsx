import { useEffect, useState } from "react";

export interface WeatherData {
  temperature: number;
  weathercode: number;
}

const WEATHER_CACHE_KEY = "weather-data";
const WEATHER_CACHE_TIME_KEY = "weather-data-time";
const ONE_DAY = 24 * 60 * 60 * 1000;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    weathercode: 0,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      const cacheTime = Number(
        localStorage.getItem(WEATHER_CACHE_TIME_KEY) || 0
      );

      if (cached && Date.now() - cacheTime < ONE_DAY) {
        setWeather(JSON.parse(cached));
        return;
      }

      try {
        const url = "/api/weather";
        const res = await fetch(url);
        console.warn("Fetched " + url + " right now!");
        const data = await res.json();
        const current = data.current_weather;

        const weatherData: WeatherData = {
          temperature: current.temperature,
          weathercode: current.weathercode,
        };

        setWeather(weatherData);
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weatherData));
        localStorage.setItem(WEATHER_CACHE_TIME_KEY, Date.now().toString());
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };

    fetchWeather();

    // Refresh daily at midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();
    let intervalId = setTimeout(() => {
      fetchWeather();
      setInterval(fetchWeather, ONE_DAY);
    }, msUntilMidnight);

    return () => clearTimeout(intervalId);
  }, []);

  return weather;
}
