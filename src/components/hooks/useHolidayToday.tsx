import { useEffect, useState } from "react";

interface Holiday {
  date: string; // "YYYY-MM-DD"
  localName: string;
  name: string;
}

const HOLIDAY_CACHE_KEY = "holiday-data";
const HOLIDAY_CACHE_TIME_KEY = "holiday-data-time";
const ONE_DAY = 24 * 60 * 60 * 1000;

export function useHolidayToday(countryCode: string = "CH") {
  const [todayHoliday, setTodayHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const cached = localStorage.getItem(HOLIDAY_CACHE_KEY);
        const cacheTime = Number(
          localStorage.getItem(HOLIDAY_CACHE_TIME_KEY) || 0
        );

        const now = Date.now();
        if (cached && now - cacheTime < ONE_DAY) {
          const holidays: Holiday[] = JSON.parse(cached);
          const todayStr = new Date().toISOString().split("T")[0];
          const holidayToday =
            holidays.find((h) => h.date === todayStr) || null;
          setTodayHoliday(holidayToday);
          return;
        }

        // Fetch from API if no valid cache
        const year = new Date().getFullYear();
        const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
        const res = await fetch(url);
        console.warn("Fetched " + url + " right now!");
        if (res.status !== 200) {
          throw new Error(`Failed to fetch holidays, status: ${res.status}`);
        }
        const holidays: Holiday[] = await res.json();

        localStorage.setItem(HOLIDAY_CACHE_KEY, JSON.stringify(holidays));
        localStorage.setItem(HOLIDAY_CACHE_TIME_KEY, now.toString());

        const todayStr = new Date().toISOString().split("T")[0];
        const holidayToday = holidays.find((h) => h.date === todayStr) || null;
        setTodayHoliday(holidayToday);
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
    };

    fetchHolidays();
  }, [countryCode]);

  return todayHoliday;
}
