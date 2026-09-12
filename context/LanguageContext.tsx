"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import enTranslations from "@/locales/en.json";
import guTranslations from "@/locales/gu.json";
import hiTranslations from "@/locales/hi.json";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

const DICTIONARIES: Record<string, Record<string, any>> = {
  en: enTranslations,
  gu: guTranslations,
  hi: hiTranslations,
};

const STORAGE_KEY = "tradenexa_language";

interface LanguageContextValue {
  currentLanguage: string;
  activeLanguageOption: LanguageOption;
  setLanguage: (langCode: string) => void;
  resetToDefaultLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<string>("en");

  // Read saved language from localStorage on initial mount & listen to changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setCurrentLanguageState(saved);
    } else {
      setCurrentLanguageState("en");
    }

    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail && SUPPORTED_LANGUAGES.some((l) => l.code === custom.detail)) {
        setCurrentLanguageState(custom.detail);
      }
    };

    window.addEventListener("tradenexa_language_change", handleCustomChange);
    return () => {
      window.removeEventListener("tradenexa_language_change", handleCustomChange);
    };
  }, []);

  const setLanguage = useCallback((langCode: string) => {
    const valid = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const code = valid ? valid.code : "en";
    setCurrentLanguageState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
      // Dispatch custom window event so listeners can re-fetch or react
      window.dispatchEvent(
        new CustomEvent("tradenexa_language_change", { detail: code })
      );
    }
  }, []);

  const resetToDefaultLanguage = useCallback(() => {
    setLanguage("en");
  }, [setLanguage]);

  /**
   * Helper to look up translation keys by dot-notation (e.g. 'nav.home' or 'common.save')
   */
  const t = useCallback(
    (key: string, defaultText?: string): string => {
      if (!key) return defaultText || "";
      const dict = DICTIONARIES[currentLanguage] || DICTIONARIES.en || {};
      const fallbackDict = DICTIONARIES.en || {};

      const resolveKey = (source: Record<string, any>, path: string) => {
        const parts = path.split(".");
        let curr: any = source;
        for (const p of parts) {
          if (curr === undefined || curr === null || typeof curr !== "object") return undefined;
          curr = curr[p];
        }
        return typeof curr === "string" ? curr : undefined;
      };

      const result = resolveKey(dict, key) || resolveKey(fallbackDict, key);
      return result !== undefined ? result : defaultText || key;
    },
    [currentLanguage]
  );

  const activeLanguageOption = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [currentLanguage]);

  const value = useMemo(
    () => ({
      currentLanguage,
      activeLanguageOption,
      setLanguage,
      resetToDefaultLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
    }),
    [currentLanguage, activeLanguageOption, setLanguage, resetToDefaultLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
