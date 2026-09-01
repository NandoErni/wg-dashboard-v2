import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface BusData {
  nextBus: Date;
}

const DEFAULT_BUS_DATA: BusData = {
  nextBus: new Date(0),
};

const BUS_API_URL =
  "/api/bus";

interface APIBusDeparture {
  departure: string;
}

export function useNextBus() {
  const { t } = useTranslation();

  const [busData, setBusData] =
    useState<BusData>(DEFAULT_BUS_DATA);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const res = await fetch(BUS_API_URL);

        if (res.status === 404) {
          setBusData(DEFAULT_BUS_DATA);
          return;
        }

        if (!res.ok) {
          throw new Error(
            `Server returned status code: ${res.status}`,
          );
        }

        const data: APIBusDeparture =
          await res.json();

        const nextBus = new Date(
          data.departure,
        );

        setBusData((previous) => {
          if (
            previous.nextBus.getTime() ===
            nextBus.getTime()
          ) {
            return previous;
          }

          return {
            nextBus,
          };
        });
      } catch (err) {
        toast(
          t("errors.couldNotLoadBusTimes"),
        );

        console.error(
          "Failed to fetch bus times:",
          err,
        );
      }
    };

    fetchBusData();

    const intervalId = setInterval(
      fetchBusData,
      30_000,
    );

    return () => clearInterval(intervalId);
  }, [t]);

  return busData;
}