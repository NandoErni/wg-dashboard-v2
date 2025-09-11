import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Clock() {
  const [time, setTime] = useState(new Date());  
  const { i18n } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      {time.toLocaleTimeString(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
    </div>
  );
}