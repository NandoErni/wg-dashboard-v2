import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "@/locales/de.json";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import { customTranslations } from "@/config/custom-translations";

const savedLanguage =
  typeof window !== "undefined" ? localStorage.getItem("app-lang") : "de-CH";

const languages = {
  "de-CH": { translation: de },
  "en-US": { translation: en },
  "tr-TR": { translation: tr },
};

i18n.use(initReactI18next).init({
  resources: languages,
  lng: savedLanguage || "de-CH",
  fallbackLng: "de-CH",
  interpolation: {
    escapeValue: false,
  },
});

Object.entries(customTranslations).forEach(([language, translations]) => {
  i18n.addResourceBundle(language, "translation", translations, true, true);
});

export default i18n;