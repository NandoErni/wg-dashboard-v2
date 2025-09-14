import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface BusData {
  nextBus: Date;
}

interface API_Connection {
  from: {
    departure: string;
  };
  transfers: number;
}

const DEFAULT_BUS_DATA = {
  nextBus: new Date(0),
};
const BUS_CACHE_KEY = "bus-data";
const BASE_BUS_API_URL = "http://transport.opendata.ch/v1/connections";

export function useNextBus() {
  const { t } = useTranslation();
  const [busData, setBusData] = useState<BusData>(DEFAULT_BUS_DATA);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-CH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const url =
          BASE_BUS_API_URL +
          `?from=8590930&to=8506000&limit=10&time=${timeStr}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(
            `Server returned status code: ${res.status}! url: ${url}`
          );
        }
        console.log("Fetched " + url);
        const data = await res.json();

        const busTimes = data.connections
          .slice(1)
          .filter((x: API_Connection) => x.transfers === 0) // there are some weird bus connections... only those that are direct!
          .map((x: API_Connection) => x.from.departure);

        const busDataArray: BusData[] = busTimes.map((x: string) => ({
          nextBus: new Date(x),
        }));

        return busDataArray;
      } catch (err) {
        toast(t("errors.couldNotLoadBusTimes"));
        console.error("Failed to fetch bus Times:", err);
        return undefined;
      }
    };

    const updateBusData = async () => {
      const cached = localStorage.getItem(BUS_CACHE_KEY);
      let nextBusEntry: BusData | undefined = undefined;

      if (cached) {
        const cachedBusTimes: BusData[] = JSON.parse(cached);
        const now = new Date();
        // Find the first bus whose nextBus is in the future
        const nextBusDate = cachedBusTimes.find(
          (bus) => new Date(bus.nextBus) > now
        );
        if (nextBusDate) {
          nextBusEntry = { nextBus: new Date(nextBusDate.nextBus) };
        }
      }

      if (!nextBusEntry) {
        const currentBusTimes = await fetchBusData();

        if (currentBusTimes) {
          if (currentBusTimes.length == 0) {
            toast(t("errors.noBusTimesAvailable"));
            return;
          }
          localStorage.setItem(BUS_CACHE_KEY, JSON.stringify(currentBusTimes));
          nextBusEntry = currentBusTimes[0];
        }
      }

      if (nextBusEntry) {
        setBusData(prevBusData => {
          if (nextBusEntry && nextBusEntry.nextBus.getTime() !== prevBusData.nextBus.getTime()) {
            return nextBusEntry;
          }
          // If no change, return the previous state. This is done like this, because the nextBusEntry object might contain the same data but is a different object
          return prevBusData;
        });
      }
    };

    updateBusData();

    const intervalId = setInterval(() => {
      updateBusData();
    }, 1000);

    return () => clearTimeout(intervalId);
  }, []);

  return busData;
}
