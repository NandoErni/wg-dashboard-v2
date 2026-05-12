import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "@/locales/de.json";
import en from "@/locales/en.json";

// Check if we have a saved language, else default
const savedLanguage =
  typeof window !== "undefined" ? localStorage.getItem("app-lang") : "de-CH";

i18n.use(initReactI18next).init({
  resources: {
    "de-CH": { translation: de },
    "en-US": { translation: en },
  },
  lng: savedLanguage || "de-CH",
  fallbackLng: "de-CH",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
