import { useEffect, useState } from "react";
import IcalExpander from "ical-expander";

export interface TrashEvent {
  summary: string;
  date: Date;
  daysUntil: number;
}

export type TypeOfTrash = "trash" | "paper";

const trashApiMap: Record<TypeOfTrash, string> = {
  trash: "/api/trash",
  paper: "/api/paper",
};

export function useNextTrashPickup(typeOfTrash: TypeOfTrash) {
  const [nextEvent, setNextEvent] = useState<TrashEvent>({summary: "", date: new Date(), daysUntil: -1});

  useEffect(() => {
    

    const fetchCalendar = async () => {
      try {
        const url = trashApiMap[typeOfTrash];
        const res = await fetch(url);
        console.warn("Fetched "+url+" right now!")
        const text = await res.text();

        const icalExpander = new IcalExpander({ ics: text, maxIterations: 1000 });
        const upcoming = icalExpander.between(
          new Date(),
          new Date(new Date().setMonth(new Date().getMonth() + 3))
        );

        if (upcoming.events.length > 0) {
          const sorted = upcoming.events.sort(
            (a, b) => a.startDate.toJSDate().getTime() - b.startDate.toJSDate().getTime()
          );
          const first = sorted[0];
          const startDate = first.startDate.toJSDate();
          const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          setNextEvent({
            summary: first.summary,
            date: startDate,
            daysUntil,
          });
        }
      } catch (error) {
        console.error("Failed to fetch calendar:", error);
      }
    };

    fetchCalendar();

    // Refresh daily at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    let intervalId = setTimeout(() => {
      fetchCalendar();
      setInterval(fetchCalendar, 24 * 60 * 60 * 1000); // every 24h
    }, msUntilMidnight);

    return () => clearTimeout(intervalId);
  }, []);

  return nextEvent;
}
