"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { useLanguageStore } from "@/store/languageStore";

export function I18nProvider({ children }: { children: ReactNode }) {
  const setLanguage = useLanguageStore(state => state.setLanguage);

  useEffect(() => {
    const lang = localStorage.getItem('devexchange_lang');
    if (lang) {
      if (lang !== i18n.language) i18n.changeLanguage(lang);
      setLanguage(lang);
    }
  }, [setLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
