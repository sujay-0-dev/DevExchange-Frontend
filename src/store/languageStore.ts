import { create } from 'zustand';

interface LanguageState {
  currentLanguage: string;
  pendingLanguage: string | null;
  setLanguage: (lang: string) => void;
  setPendingLanguage: (lang: string | null) => void;
}

export const useLanguageStore = create<LanguageState>()((set) => ({
  currentLanguage: 'en',
  pendingLanguage: null,
  setLanguage: (lang: string) => {
    localStorage.setItem('devexchange_lang', lang);
    set({ currentLanguage: lang });
  },
  setPendingLanguage: (lang: string | null) => set({ pendingLanguage: lang })
}));
