import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import ja from "../locales/ja.json";

// Get browser language or use fallback
const getBrowserLanguage = (): "en" | "ko" | "ja" => {
  // Use stored locale if present
  if (typeof window !== "undefined" && window.localStorage) {
    const stored = window.localStorage.getItem("locale");
    if (stored === "en" || stored === "ko" || stored === "ja") {
      return stored;
    }
  }
  // Check if window is defined (client-side rendering)
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.language
  ) {
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === "en" || browserLang === "ko" || browserLang === "ja"
      ? browserLang
      : "en";
  }
  return "en"; // Default fallback for non-browser environments
};

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    lng: getBrowserLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })
  .catch((error) => {
    console.error("i18next initialization error:", error);
  });

export const getLocale = (): "en" | "ko" | "ja" => {
  // Safely access i18next language in any environment
  if (i18next.language) {
    const lang = i18next.language.slice(0, 2);
    return lang === "en" || lang === "ko" || lang === "ja" ? lang : "en";
  }

  return "en";
};

export const setLocale = (locale: "en" | "ko" | "ja"): void => {
  // Persist selection
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem("locale", locale);
  }
  void i18next.changeLanguage(locale);
};

type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number
        ? `${K}` | (T[K] extends object ? `${K}.${NestedKeys<T[K]>}` : never)
        : never;
    }[keyof T]
  : "";

export const t = (
  param: NestedKeys<typeof en>,
  mapObj?: Record<string, any>
): string => {
  return i18next.t(param, mapObj);
};

export default i18next;
