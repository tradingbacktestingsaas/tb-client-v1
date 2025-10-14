"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

import en from "../../../public/locales/en.json";
import es from "../../../public/locales/es.json";

type SupportedLanguage = "en" | "es";

const flagMap: Record<SupportedLanguage, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

// ✅ Flatten nested JSON to dot notation
const flattenMessages = (
  nestedMessages: any,
  prefix = ""
): Record<string, string> => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {} as Record<string, string>);
};

// ✅ Apply flattening to both languages
const messages = {
  en: flattenMessages(en),
  es: flattenMessages(es),
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  flag: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as SupportedLanguage;
    if (storedLang && messages[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    localStorage.setItem("lang", lang);
    setLanguageState(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    flag: flagMap[language],
  };

  // ✅ Debugging step — check the loaded messages
  console.log("Loaded language:", language);
  console.log("Flattened messages:", messages[language]);

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider locale={language} messages={messages[language]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
