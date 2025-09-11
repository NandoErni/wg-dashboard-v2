import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ClockProps {
  config?: "time" | "date";
}

export default function Clock({ config }: ClockProps) {
  const [time, setTime] = useState(new Date());
  const { i18n } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString =
    config === "time"
      ? time.toLocaleTimeString(i18n.language, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : time.toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

  return <div className="text-center">{timeString}</div>;
}
