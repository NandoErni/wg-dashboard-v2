import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { appConfig } from "@/config/app-config";

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

        const params = new URLSearchParams({
          from: appConfig.dashboard.sbbBus.from,
          to: appConfig.dashboard.sbbBus.to,
          limit: String(10),
          time: timeStr,
        });

        const url = `${BASE_BUS_API_URL}?${params.toString()}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(
            `Server returned status code: ${res.status}! url: ${url}`,
          );
        }

        console.log("Fetched " + url);
        const data = await res.json();

        const busTimes = data.connections
          .slice(1)
          .filter((x: API_Connection) => x.transfers === 0)
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

        const nextBusDate = cachedBusTimes.find(
          (bus) => new Date(bus.nextBus) > now,
        );

        if (nextBusDate) {
          nextBusEntry = { nextBus: new Date(nextBusDate.nextBus) };
        }
      }

      if (!nextBusEntry) {
        const currentBusTimes = await fetchBusData();

        if (currentBusTimes) {
          if (currentBusTimes.length === 0) {
            toast(t("errors.noBusTimesAvailable"));
            return;
          }

          localStorage.setItem(BUS_CACHE_KEY, JSON.stringify(currentBusTimes));
          nextBusEntry = currentBusTimes[0];
        }
      }

      if (nextBusEntry) {
        setBusData((prevBusData) => {
          if (
            nextBusEntry &&
            nextBusEntry.nextBus.getTime() !== prevBusData.nextBus.getTime()
          ) {
            return nextBusEntry;
          }

          return prevBusData;
        });
      }
    };

    updateBusData();

    const intervalId = setInterval(() => {
      updateBusData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [t]);

  return busData;
}