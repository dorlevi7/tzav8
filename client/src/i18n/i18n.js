import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "./he.json";
import en from "./en.json";

// load saved language or default to Hebrew
const savedLang = localStorage.getItem("lang") || "he";

i18n.use(initReactI18next).init({
    resources: {
        he: { translation: he },
        en: { translation: en },
    },

    lng: savedLang,
    fallbackLng: "he",

    interpolation: {
        escapeValue: false,
    },
});

// update direction when language changes
i18n.on("languageChanged", (lng) => {
    document.documentElement.dir = lng === "he" ? "rtl" : "ltr";
    localStorage.setItem("lang", lng);
});

export default i18n;