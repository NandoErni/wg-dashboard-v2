import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations (or load dynamically)
import de from "@/locales/de.json";
import en from "@/locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      "de-CH": { translation: de },
      "en-US": { translation: en },
    },
    lng: "de-CH",
    fallbackLng: "de-CH",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
