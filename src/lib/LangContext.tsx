"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, t } from "./i18n";

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; tr: (key: string) => string; }
const Ctx = createContext<LangCtx>({ lang: "de", setLang: () => {}, tr: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = localStorage.getItem("cleverli_lang") as Lang;
    if (stored && ["de","fr","it","en"].includes(stored)) {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("cleverli_lang", l);
    // Keep the HTML lang attribute in sync with the selected language
    document.documentElement.lang = l;
  };

  const tr = (key: string) => t[lang][key] ?? t["de"][key] ?? key;
  return <Ctx.Provider value={{ lang, setLang, tr }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
